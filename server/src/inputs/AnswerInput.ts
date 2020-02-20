import { InputType, Field } from "type-graphql";
import { QuestionAnswerInput } from "./QuestionAnswerInput";

@InputType()
export class AnswerInput {
  @Field()
  content: string;

  @Field()
  questionId: string;

  @Field(type => [QuestionAnswerInput], { nullable: true })
  answerChoices: QuestionAnswerInput[];
}
