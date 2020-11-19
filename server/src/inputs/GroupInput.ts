import { InputType, Field } from "type-graphql";
import { IsOptional, IsDate } from "class-validator";

@InputType()
export class GroupInput {
  @Field(type => [String])
  userIds: string[];

  @Field({ nullable: true })
  @IsOptional()
  id: string;

  @Field()
  groupName: string;

  @Field({ nullable: true })
  @IsOptional()
  groupMessage: string;
}
