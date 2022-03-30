import { InputType, Field } from "type-graphql";
import { WorkingTimesInput } from "./WorkingTimesInput";
import { QuestionAnswerInput } from "./QuestionAnswerInput";

@InputType()
export class AnswerInput {
  @Field({ nullable: true })
  content: string;

  @Field()
  questionId: string;

  @Field(() => [QuestionAnswerInput], { nullable: true })
  answerChoices: QuestionAnswerInput[];

  @Field(() => [WorkingTimesInput], { nullable: true })
  workingTimes: WorkingTimesInput[];
}
