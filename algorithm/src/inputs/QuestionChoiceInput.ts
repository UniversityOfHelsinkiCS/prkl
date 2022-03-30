import { InputType, Field } from "type-graphql";

@InputType()
export class QuestionChoiceInput {
  @Field({ nullable: true })
  id: string;

  @Field()
  content: string;

  @Field()
  order: number;
}
