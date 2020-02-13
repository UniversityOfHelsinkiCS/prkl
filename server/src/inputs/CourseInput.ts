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
  deadline: string;

  @Field()
  max_group_size: number;

  @Field()
  min_group_size: number;

  @Field(type => [QuestionsInput])
  questions: QuestionsInput[];
}
