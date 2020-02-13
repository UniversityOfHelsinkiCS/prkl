import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Course } from "../entities/Course";
import { CourseInput } from "../inputs/CourseInput";

@Resolver()
export class CourseResolver {
  @Query(() => [Course])
  courses() {
    return Course.find({ relations: ["questions"] });
  }

  @Query(() => Course)
  course(@Arg("id") id: string) {
    return Course.findOne({ where: { id } });
  }

  @Mutation(() => Course)
  async createCourse(@Arg("data") data: CourseInput) {
    console.log("data:", data);
    const course = Course.create(data);

    console.log("course:", course);

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
