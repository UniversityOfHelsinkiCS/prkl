import { InputType, Field } from "type-graphql";
import { QuestionsInput } from "./QuestionsInput";
import { IsOptional, IsDate } from "class-validator";
import { UserInput } from "./UserInput";

@InputType()
export class CourseInput {
  @Field()
  title: string;

  @Field()
  @IsOptional()
  description: string;

  @Field()
  code: string;

  @Field()
  @IsDate()
  deadline: Date;

  @Field()
  maxGroupSize: number;

  @Field()
  minGroupSize: number;

  @Field()
  published: boolean;

  @Field(type => [QuestionsInput])
  questions: QuestionsInput[];

  @Field(type => [UserInput])
  teachers: UserInput[];
}
