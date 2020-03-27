import { InputType, Field } from "type-graphql";

@InputType()
export class GroupInput {
  @Field(type => [String])
  userIds: string[];
}
