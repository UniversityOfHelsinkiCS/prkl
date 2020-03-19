import { InputType, Field } from "type-graphql";
import { GroupInput } from "./GroupInput";

@InputType()
export class GroupListInput {
  @Field()
  courseId: string;

  @Field(type => [GroupInput], { nullable: true })
  groups: GroupInput[];
}
