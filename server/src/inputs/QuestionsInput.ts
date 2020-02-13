import { InputType, Field } from "type-graphql";
import { ReplyInput } from "./ReplyInput";

@InputType()
export class QuestionsInput {
  @Field()
  name: string;

  @Field(type => [ReplyInput])
  replies: ReplyInput[];
}
