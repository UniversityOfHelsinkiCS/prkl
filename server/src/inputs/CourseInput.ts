import { InputType, Field } from "type-graphql";
import { QuestionsInput } from "./QuestionsInput";

@InputType()
export class CourseInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  code: string;

  // @Field()
  // id: string;

  @Field()
  deadline: Date;

  @Field()
  maxGroupSize: number;

  @Field()
  minGroupSize: number;

  @Field(type => [QuestionsInput])
  questions: QuestionsInput[];
}
