import { InputType, Field } from "type-graphql";

@InputType()
export class CreateReplyInput {
  @Field()
  value: number;
}
