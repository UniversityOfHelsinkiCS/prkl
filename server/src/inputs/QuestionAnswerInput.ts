import { InputType, Field } from "type-graphql";

@InputType()
export class QuestionAnswerInput {
  @Field()
  id: string;
}
