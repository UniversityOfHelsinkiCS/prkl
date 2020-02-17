import { InputType, Field } from "type-graphql";
import { ReplyInput } from "./ReplyInput";

@InputType()
export class RegistrationInput {
  @Field()
  courseId: string;

  @Field(type => [ReplyInput])
  questionReplies: ReplyInput[];
}
