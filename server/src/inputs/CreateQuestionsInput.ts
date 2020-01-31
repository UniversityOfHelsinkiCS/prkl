import { InputType, Field } from "type-graphql";
import { CreateReplyInput } from "./CreateReplyInput";

@InputType()
export class CreateQuestionsInput {
  @Field()
  name: string;

  @Field(type => [CreateReplyInput])
  replies: CreateReplyInput[];
}
