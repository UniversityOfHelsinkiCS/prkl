import { InputType, Field } from "type-graphql";

@InputType()
export class AnswerInput {
  @Field()
  content: string;

  @Field()
  questionId: string;
}
