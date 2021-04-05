import { Field, InputType, Int } from "type-graphql";
import { Registration } from "../entities/Registration";

@InputType()
export class GenerateGroupsInput {
  @Field()
  courseId: string;

  @Field(() => Int)
  targetGroupSize: number;

  @Field(() => [String])
  registrationIds: Registration["id"][];
}
