import { Field, InputType, Int } from "type-graphql";
import { Registration } from "../entities/Registration";

@InputType()
export class GenerateGroupsInput {
  @Field()
  courseId: string

  @Field(type => Int)
  targetGroupSize: number

  @Field(type => [String])
  registrationIds: Registration["id"][]
}