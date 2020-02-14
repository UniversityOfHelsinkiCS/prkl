import { InputType, Field } from "type-graphql";
import { User } from "../entities/User";
import { Course } from "../entities/Course";
import { CourseInput } from "./CourseInput";
import { UserInput } from "./UserInput";

@InputType()
export class GroupInput {
  @Field(type => [UserInput])
  students: User[];

  @Field(type => CourseInput)
  course: Course;
}
