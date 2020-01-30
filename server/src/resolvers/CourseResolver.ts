import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Course } from "../entity/Course";
import { CreateCourseInput } from "../inputs/CreateCourseInput";

@Resolver()
export class CourseResolver {
  @Query(() => [Course])
  courses() {
    return Course.find();
  }

  @Query(() => Course)
  course(@Arg("id") id: string) {
    return Course.findOne({ where: { id } });
  }

  @Mutation(() => Course)
  async createCourse(@Arg("data") data: CreateCourseInput) {
    const course = Course.create(data);
    await course.save();
    return course;
  }

  @Mutation(() => Boolean)
  async deleteCourse(@Arg("id") id: string) {
    const course = await Course.findOne({ where: { id } });
    if (!course) throw new Error("Course not found!");
    await course.remove();
    return true;
  }
}
