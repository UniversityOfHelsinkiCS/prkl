import { InputType, Field } from "type-graphql";

@InputType()
export class QuestionAnswerInput {
  // questionChoice id
  @Field()
  id: string;
}
