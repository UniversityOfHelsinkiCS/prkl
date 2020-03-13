import { InputType, Field } from "type-graphql";

@InputType()
export class WorkingTimesInput {
  @Field()
  questionId: string;

  @Field()
  startTime: Date;

  @Field()
  endTime: Date;
}
