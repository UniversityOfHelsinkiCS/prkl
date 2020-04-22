import { InputType, Field } from "type-graphql";
import { AnswerInput } from "./AnswerInput";
import { WorkingTimesInput } from "./WorkingTimesInput";

@InputType()
export class RegistrationInput {
  @Field()
  courseId: string;

  @Field(type => [AnswerInput], { nullable: true })
  questionAnswers: AnswerInput[];

  @Field(type => [WorkingTimesInput], { nullable: true })
  workingTimes: WorkingTimesInput[];
}
