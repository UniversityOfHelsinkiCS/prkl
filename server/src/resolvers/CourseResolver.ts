import { STAFF, ADMIN } from "./../utils/userRoles";
import { Resolver, Query, Mutation, Arg, Ctx, Authorized } from "type-graphql";
import { Course } from "../entities/Course";
import { User } from "../entities/User";
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
    const course = await Course.findOne({ where: { id } });
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
    // TODO: Update questions on the server too
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
