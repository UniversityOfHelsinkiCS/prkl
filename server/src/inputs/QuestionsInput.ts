import { InputType, Field } from "type-graphql";
import { ReplyInput } from "./ReplyInput";

@InputType()
export class QuestionsInput {
  @Field()
  content: string;

  @Field(type => [ReplyInput], { nullable: true })
  replies: ReplyInput[];
}
