import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import _, { orderBy } from "lodash";
import { User } from "../entities/User";
import { Course } from "../entities/Course";
import { Question } from "../entities/Question";
import { QuestionChoice } from "../entities/QuestionChoice";
import { CourseInput } from "../inputs/CourseInput";
import { ADMIN, STAFF } from "../utils/userRoles";

@Resolver()
export class CourseResolver {
  @Query(() => [Course, User])
  async courses(@Ctx() context): Promise<Course[]> {
    const { user } = context;

    if (user.role < STAFF) {
      return getRepository(Course)
        .createQueryBuilder("course")
        .select(["course", "user.id", "user.firstname", "user.lastname", "user.email"])
        .leftJoin("course.teachers", "user")
        .where("teacherId = user.id")
        .where("deleted = false")
        .andWhere("published = true")
        .getMany();
    } else {
      const courses = await Course.find({ where: { deleted: false }, relations: ["teachers"] });

      if (user.role < ADMIN) {
        courses.map(c => {
          c.teachers.map(t => {
            (t.studentNo = null), (t.shibbolethUid = null);
          });
        });
      }

      return courses;
    }
  }

  @Query(() => [Course])
  async getCourseByCode(@Ctx() context, @Arg("code") code: string): Promise<Course[]> {
    const { user } = context;

    const courses = await Course.find({
      where: { code },
      relations: ["questions", "questions.questionChoices", "teachers"],
      order: { createdAt: "DESC" },
      take: 1,
    });

    if (!courses || user.role < STAFF) {
      throw new Error("Course not found.");
    }

    return courses;
  }

  @Query(() => Course)
  async course(@Ctx() context, @Arg("id") id: string): Promise<Course> {
    const { user } = context;
    const course = await Course.findOne({
      where: { id },
      relations: ["questions", "questions.questionChoices", "teachers"],
    });

    if ((course.deleted === true || course.published === false) && user.role < STAFF) {
      throw new Error("Nothing to see here.");
    }

    /*
    if (course.deadline < new Date() && user.role < STAFF) {
      throw new Error("The registration deadline for this course has already passed.");
    }
    */

    if (user.role !== ADMIN && (user.role < STAFF || course.teachers.find(t => t.id === user.id) === undefined)) {
      course.teachers.map(t => {
        (t.studentNo = null), (t.shibbolethUid = null);
      });
    }

    return course;
  }

  @Authorized(STAFF)
  @Mutation(() => Course)
  async createCourse(@Ctx() context, @Arg("data") data: CourseInput): Promise<Course> {
    const course = Course.create(data);
    if (data.teachers.length === 0) {
      const { user } = context;
      course.teachers = [user];
    }

    await course.save();
    return course;
  }

  @Authorized(STAFF)
  @Mutation(() => Boolean)
  async publishCourseGroups(@Ctx() context, @Arg("id") id: string): Promise<boolean> {
    const { user } = context;
    const course = await Course.findOne({ where: { id }, relations: ["teachers"] });

    if (!course) {
      throw new Error("Course with given id not found");
    }

    if (user.role === ADMIN || course.teachers.find(t => t.id === user.id) !== undefined) {
      course.groupsPublished = true;
      await course.save();
      return true;
    }

    throw new Error("No authorization for publishing groups");
  }

  @Authorized(STAFF)
  @Mutation(() => Course)
  async updateCourse(@Ctx() context, @Arg("id") id: string, @Arg("data") data: CourseInput): Promise<Course> {
    const { user } = context;

    const course = await Course.findOne({
      where: { id },
      relations: ["teachers", "questions", "questions.questionChoices"],
    });

    if (!course) {
      throw new Error("Course with given id not found.");
    }

    if (user.role !== ADMIN && !course.teachers.map(t => t.id).includes(user.id)) {
      throw new Error("You do not have authorization to update this course.");
    }

    course.title = data.title;
    course.description = data.description;
    course.code = data.code;
    course.deadline = data.deadline;
    course.workTimeEndsAt = data.workTimeEndsAt;
    course.minHours = data.minHours;
    course.weekends = data.weekends;

    // Published course questions or their choices may not be added or deleted even by admins
    if (course.published) {
      const hasSameQuestionsAndChoices = course.questions.filter(q => {
        return data.questions.some(dq => {
          let newChoices = dq.questionChoices?.map(dqChoice => dqChoice.id);
          let oldChoices = q.questionChoices?.map(qChoice => qChoice.id);
          if (!newChoices) newChoices = [];
          if (!oldChoices) oldChoices = [];
          return dq.id === q.id && _.isEqual(_.sortBy(newChoices), _.sortBy(oldChoices));
        });
      });

      if (hasSameQuestionsAndChoices.length !== course.questions.length) {
        throw new Error("Adding or deleting questions or questionChoices is not allowed for a published course.");
      }
    }

    // Temporarily bump up all orders of this courses questions to very big numbers so they don't collide
    // with incoming new order values.
    await Promise.all(
      course.questions.map(async q => {
        q.order = 100000 + q.order;
        await q.save();
      }),
    );

    const removedQuestionIds = course.questions
      .filter(q => {
        return !data.questions.some(dq => dq.id === q.id);
      })
      .map(q => q.id);

    // Ensure only one timetable is added per course
    let hasTimetable = false;
    const questions = data.questions.filter(q => {
      if (q.questionType !== "times") return true;
      if (hasTimetable) return false;
      hasTimetable = true;
      return true;
    });

    course.questions = await Promise.all(
      questions.map(async q => {
        const newQuestion = await Question.create(q);
        if (!newQuestion.questionChoices) newQuestion.questionChoices = [];
        return newQuestion;
      }),
    );

    course.published = data.published;

    if (data.teachers.length === 0) {
      const { user } = context;
      course.teachers = [user];
    } else {
      const courseTeachers = [];
      const t = data.teachers.map(teacher => teacher.id);
      for (const index in t) {
        const id = t[index];
        const user = await User.findOne({ where: { id } });
        courseTeachers.push(user);
      }

      course.teachers = courseTeachers;
    }

    await course.save();

    // Cleanup
    await getRepository(QuestionChoice)
      .createQueryBuilder("questionChoice")
      .delete()
      .where('"questionChoice"."questionId" is NULL')
      .orWhere('"questionChoice"."questionId" = ANY (:ids)', { ids: removedQuestionIds })
      .execute();

    await getRepository(Question)
      .createQueryBuilder("question")
      .delete()
      .where('question."courseId" is NULL')
      .execute();

    return course;
  }

  @Authorized(STAFF)
  @Mutation(() => String)
  async deleteCourse(@Ctx() context, @Arg("id") id: string): Promise<string> {
    const { user } = context;
    const course = await Course.findOne({ where: { id }, relations: ["teachers"] });
    if (!course) throw new Error("Course not found!");
    // Staff member can only delete own, unpublished course. Error handling might require improvements.
    if (
      user.role === ADMIN ||
      (course.teachers.find(t => t.id === user.id) !== undefined && course.published === false)
    ) {
      course.deleted = true;
      await course.save();
      return course.id;
    }

    throw new Error("No authorization to delete course.");
  }
}
