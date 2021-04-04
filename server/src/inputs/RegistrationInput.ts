import { InputType, Field } from "type-graphql";
import { AnswerInput } from "./AnswerInput";
import { WorkingTimesInput } from "./WorkingTimesInput";

@InputType()
export class RegistrationInput {
  @Field()
  courseId: string;

  @Field(() => [AnswerInput], { nullable: true })
  questionAnswers: AnswerInput[];

  @Field(() => [WorkingTimesInput], { nullable: true })
  workingTimes: WorkingTimesInput[];
}
