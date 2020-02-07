import { InputType, Field } from "type-graphql";
import { CreateUserInput } from "./CreateUserInput";
@InputType()
export class CreateReplyInput {
  @Field()
  value: number;
}
