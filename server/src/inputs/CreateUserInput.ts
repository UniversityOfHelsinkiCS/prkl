import { InputType, Field } from "type-graphql";
// import { CreateQuestionsInput } from "./CreateQuestionsInput";

@InputType()
export class CreateUserInput {
  @Field()
  shibbolethUid: string;

  @Field()
  role: number;
}
