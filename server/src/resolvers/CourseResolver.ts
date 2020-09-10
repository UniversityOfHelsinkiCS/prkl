import { STAFF } from "./../utils/userRoles";
import { Resolver, Query, Mutation, Arg, Ctx, Authorized } from "type-graphql";
import { Course } from "../entities/Course";
import { CourseInput } from "../inputs/CourseInput";
import { getRepository } from "typeorm";

@Resolver()
export class CourseResolver {
  @Query(() => [Course])
  async courses(@Ctx() context): Promise<Course[]> {
    const { user } = context;
    if (user.role < STAFF) {
      return getRepository(Course)
        .createQueryBuilder()
        .where("deleted = false")
        .andWhere("deadline > NOW()")
        .getMany();
    } else {
      return Course.find({ where: { deleted: false } });
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
  @Mutation(() => Boolean)
  async deleteCourse(@Arg("id") id: string): Promise<boolean> {
    const course = await Course.findOne({ where: { id } });
    if (!course) throw new Error("Course not found!");
    course.deleted = true;
    await course.save();
    return true;
  }
}
