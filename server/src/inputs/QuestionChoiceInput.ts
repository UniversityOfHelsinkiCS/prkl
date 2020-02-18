import { InputType, Field } from "type-graphql";

@InputType()
export class QuestionChoiceInput {
  @Field()
  content: string;

  //This is null if the question is multiple choise, in ordered answer choises this needs to be filled
  @Field({ nullable: true })
  order: number;
}
