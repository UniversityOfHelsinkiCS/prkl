import { InputType, Field } from "type-graphql";
import { QuestionAnswerInput } from "./QuestionAnswerInput";
import { WorkingTimesInput } from "./WorkingTimesInput";

@InputType()
export class AnswerInput {
  @Field({ nullable: true })
  content: string;

  @Field()
  questionId: string;

  @Field(type => [QuestionAnswerInput], { nullable: true })
  answerChoices: QuestionAnswerInput[];

  @Field(type => [WorkingTimesInput], { nullable: true })
  workingTimes: WorkingTimesInput[];
}
