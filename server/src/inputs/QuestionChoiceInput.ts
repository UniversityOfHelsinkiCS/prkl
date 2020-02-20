import { InputType, Field } from "type-graphql";

@InputType()
export class QuestionChoiceInput {
  @Field()
  content: string;

  @Field()
  order: number;
}
