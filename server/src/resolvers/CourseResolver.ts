import { STAFF, ADMIN } from "./../utils/userRoles";
import { Resolver, Query, Mutation, Arg, Ctx, Authorized } from "type-graphql";
import { Course } from "../entities/Course";
import { User } from "../entities/User";
import { Question } from "../entities/Question";
import { CourseInput } from "../inputs/CourseInput";
import { getRepository } from "typeorm";

@Resolver()
export class CourseResolver {
  @Query(() => [Course, User])
  async courses(@Ctx() context): Promise<Course[]> {
    const { user } = context;
    if (user.role < STAFF) {
      return getRepository(Course)
        .createQueryBuilder("course")
        .leftJoinAndSelect("course.teacher", "user")
        .where("teacherId = user.id") // Pitääkö kurssin näkyä opiskelijalle, jos hän on luonut sen ollessaan opettaja (roolihan voi muuttua), vaikka kurssi ei olisi enää kurantti?
        .where("deleted = false")
        .andWhere("published = true")
        .andWhere("deadline > NOW()")
        .getMany();
    } else {
      return Course.find({ where: { deleted: false }, relations: ["teacher"] });
    }
  }

  @Query(() => Course)
  async course(@Ctx() context, @Arg("id") id: string): Promise<Course> {
    const { user } = context;
    const course = await Course.findOne({ where: { id }, relations: ["questions", "questions.questionChoices"] });

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
    const course = Course.create(data);
    course.teacher = context.user;
    await course.save();
    return course;
  }

  @Authorized(STAFF)
  @Mutation(() => Course)
  async updateCourse(@Ctx() context, @Arg("id") id: string, @Arg("data") data: CourseInput): Promise<Course> {
    const { user } = context;
    const course = await Course.findOne({ where: { id }, relations: ["teacher", "questions", "questions.questionChoices"] });
    if (!course) {
      throw new Error("Course with given id not found.");
    }
    if (course.published && user.role !== ADMIN) {
      throw new Error("You do not have authorization to update a published course.");
    }

    course.title = data.title;
    course.description = data.description;
    course.code = data.code;
    course.published = data.published;
    course.deadline = data.deadline;

    // Temp fix to ensure published course questions cannot be edited by anyone for now
    if (course.published) {
      await course.save();
      return course;
    }

    // Delete all old questions and their questionChoices
    // Note: This will break things if (when) we need to
    // change existing questions without removing them (by
    // admin after the course has been published). This is a
    // temp solution to make updating questions to work for now.
    await Promise.all(course.questions.map(async q => {
      await Promise.all(q.questionChoices.map(async qc => {
        await qc.remove();
      }));
      q.questionChoices = [];
      await q.remove();
    }));
    course.questions = [];

    // Ensure each course has no more than one timetable
    let hasTimetable = false;
    const questions = data.questions.filter(q => {
      if (q.questionType !== 'times') return true;
      if (hasTimetable) return false;
      hasTimetable = true;
      return true;
    });
    const qsts = await Promise.all(questions.map(async q => {
      const newQuestion = await Question.create(q);
      return newQuestion;
    }));
    course.questions = qsts;
    await course.save();
    return course;
  }

  @Authorized(STAFF)
  @Mutation(() => Boolean)
  async deleteCourse(@Arg("id") id: string): Promise<boolean> {
    const course = await Course.findOne({ where: { id } });
    if (!course) throw new Error("Course not found!");
    course.deleted = true;
    await course.save();
    return true;
  }
}
