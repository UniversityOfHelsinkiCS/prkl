import { InputType, Field } from "type-graphql";

@InputType()
export class WorkingTimesInput {
  @Field()
  startTime: Date;

  @Field()
  endTime: Date;

  @Field({ nullable: true })
  tentative: boolean;
}
