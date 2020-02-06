import { InputType, Field } from "type-graphql";
import { User } from "../entity/User";
import { Course } from "../entity/Course";
import { CreateCourseInput } from "./CreateCourseInput";
import { CreateUserInput } from "./CreateUserInput";

@InputType()
export class CreateGroupInput {
  @Field(type => [CreateUserInput])
  students: User[];

  @Field(type => CreateCourseInput)
  course: Course;
}
