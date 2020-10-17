import { STAFF, ADMIN } from "./../utils/userRoles";
import { Resolver, Query, Mutation, Arg, Ctx, Authorized } from "type-graphql";
import { Course } from "../entities/Course";
import { User } from "../entities/User";
import { Question } from "../entities/Question";
import { CourseInput } from "../inputs/CourseInput";
import { getRepository } from "typeorm";
import { QuestionChoice } from "../entities/QuestionChoice";
import _ from 'lodash';

@Resolver()
export class CourseResolver {
  @Query(() => [Course, User])
  async courses(@Ctx() context): Promise<Course[]> {
    const { user } = context;
    if (user.role < STAFF) {
      return getRepository(Course)
        .createQueryBuilder("course")
        .leftJoinAndSelect("course.teachers", "user")
        .where("teacherId = user.id") // Pitääkö kurssin näkyä opiskelijalle, jos hän on luonut sen ollessaan opettaja (roolihan voi muuttua), vaikka kurssi ei olisi enää kurantti?
        .where("deleted = false")
        .andWhere("published = true")
        .andWhere("deadline > NOW()")
        .getMany();
    } else {
      return Course.find({ where: { deleted: false }, relations: ["teachers"] });
    }
  }

  @Query(() => Course)
  async course(@Ctx() context, @Arg("id") id: string): Promise<Course> {
    const { user } = context;
    const course = await Course.findOne({ where: { id }, relations: ["questions", "questions.questionChoices", "teachers"] });

    if ((course.deleted === true || course.published === false) && user.role < STAFF) {
      throw new Error("Nothing to see here."); // Viesti on placeholder.
    }

    if (course.deadline < new Date() && user.role < STAFF) {
      throw new Error("The registration deadline for this course has already passed.");
    }

    return course;
  }

  @Authorized(STAFF)
  @Mutation(() => Course)
  async createCourse(@Ctx() context, @Arg("data") data: CourseInput): Promise<Course> {
    // if (data.teachers.length === 0) {
    //   throw new Error("Course must have at least one teacher.");
    // }

    const course = Course.create(data);
    if (data.teachers.length === 0) {
      const { user } = context;
      course.teachers = [user];
    }
    console.log('course is:', course);
    await course.save();
    return course;
  }

  @Authorized(STAFF)
  @Mutation(() => Course)
  async updateCourse(@Ctx() context, @Arg("id") id: string, @Arg("data") data: CourseInput): Promise<Course> {
    const { user } = context;
    const course = await Course.findOne({ where: { id }, relations: ["teachers", "questions", "questions.questionChoices"] });
    if (!course) {
      throw new Error("Course with given id not found.");
    }
    if (course.published && user.role !== ADMIN) {
      throw new Error("You do not have authorization to update a published course.");
    }

    course.title = data.title;
    course.description = data.description;
    course.code = data.code;
    course.deadline = data.deadline;

    // Published course questions or their choices may not be added or deleted even by admins, as it will likely mess up the algorithm
    if (course.published) {
      const hasSameQuestionsAndChoices = course.questions.filter(q => {
        return data.questions.some(dq => {
          let newChoices = dq.questionChoices?.map(dqChoice => dqChoice.id);
          let oldChoices = q.questionChoices?.map(qChoice => qChoice.id);
          if (!newChoices) newChoices = [];
          if (!oldChoices) oldChoices = [];
          return dq.id === q.id 
            && _.isEqual(_.sortBy(newChoices), _.sortBy(oldChoices));
        });
      });
      if (hasSameQuestionsAndChoices.length !== course.questions.length) {
        throw new Error("Adding or deleting questions or questionChoices is not allowed for a published course.");
      }
    };

    // Really could not come up with a better way to ensure no order conflicts happen during update...
    // Basically just temporarily bump up all orders of this courses questions to very big numbers so they don't collide
    // with incoming new order values.
     await Promise.all(course.questions.map(async (q) => {
      q.order = 100000 + q.order;
      await q.save();
    }));

    const removedQuestionIds = course.questions.filter(q => {
      return !data.questions.some(dq => dq.id === q.id);
    }).map(q => q.id);

    // Ensure only one timetable is added per course
    let hasTimetable = false;
    const questions = data.questions.filter(q => {
      if (q.questionType !== 'times') return true;
      if (hasTimetable) return false;
      hasTimetable = true;
      return true;
    });
    const qsts = await Promise.all(questions.map(async q => {
      const newQuestion = await Question.create(q);
      if (!newQuestion.questionChoices)
        newQuestion.questionChoices = [];
      return newQuestion;
    }));
    course.questions = qsts;
    course.published = data.published;

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
  @Mutation(() => Boolean)
  async deleteCourse(@Ctx() context, @Arg("id") id: string): Promise<boolean> {
    const { user } = context;
    const course = await Course.findOne({ where: { id }, relations: ["teachers"] });
    if (!course) throw new Error("Course not found!");
    // Staff member can only delete own, unpublished course. Error handling might require improvements.
    if (user.role === ADMIN || (course.teachers.find(t => t.id === user.id) !== undefined && course.published === false)) {
      course.deleted = true;
      await course.save();
      return true;
    }
    throw new Error("No authorization to delete course.");
  }
}
