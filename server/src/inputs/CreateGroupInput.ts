import { InputType, Field } from "type-graphql";
import { User } from "../entity/User";
import { Course } from "../entity/Course";
import { CreateCourseInput } from "./CreateCourseInput";
import { UserInput } from "./UserInput";

@InputType()
export class CreateGroupInput {
  @Field(type => [UserInput])
  students: User[];

  @Field(type => CreateCourseInput)
  course: Course;
}
