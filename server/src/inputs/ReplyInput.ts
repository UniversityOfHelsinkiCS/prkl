import { InputType, Field } from "type-graphql";

@InputType()
export class ReplyInput {
  @Field()
  value: number;
}
