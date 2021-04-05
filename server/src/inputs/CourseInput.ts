import { IsOptional, IsDate } from "class-validator";
import { InputType, Field } from "type-graphql";
import { UserInput } from "./UserInput";
import { QuestionsInput } from "./QuestionsInput";

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

  @Field(() => [QuestionsInput])
  questions: QuestionsInput[];

  @Field(() => [UserInput])
  teachers: UserInput[];
}
