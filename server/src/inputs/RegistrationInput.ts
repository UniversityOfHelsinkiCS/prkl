import { InputType, Field } from "type-graphql";
import { AnswerInput } from "./AnswerInput";

@InputType()
export class RegistrationInput {
  @Field()
  courseId: string;

  @Field(type => [AnswerInput])
  questionAnswers: AnswerInput[];
}
