import { STAFF } from "./../utils/userRoles";
import { Resolver, Query, Mutation, Arg, Ctx, Authorized } from "type-graphql";
import { Course } from "../entities/Course";
import { CourseInput } from "../inputs/CourseInput";

@Resolver()
export class CourseResolver {
  @Query(() => [Course])
  courses(): Promise<Course[]> {
    return Course.find({ where: { deleted: false } });
  }

  @Query(() => Course)
  course(@Arg("id") id: string): Promise<Course> {
    return Course.findOne({ where: { id }, relations: ["questions", "questions.questionChoices"] });
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

  @Authorized(STAFF)
  @Mutation(() => Course)
  async editMinMaxCourse(@Arg("id") id: string, @Arg("min") min: number, @Arg("max") max: number): Promise<Course> {
    const course = await Course.findOne({ where: { id } });
    if (!course) throw new Error("Course not found!");
    course.minGroupSize = min;
    course.maxGroupSize = max;
    await course.save();
    return course;
  }
}
