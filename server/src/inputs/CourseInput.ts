import { InputType, Field } from "type-graphql";
import { QuestionsInput } from "./QuestionsInput";
import { IsOptional, IsDate } from "class-validator";

@InputType()
export class CourseInput {
  // @Field()
  // id: string;

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
}
