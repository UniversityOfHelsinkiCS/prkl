import { InputType, Field } from "type-graphql";
// import { CreateQuestionsInput } from "./CreateQuestionsInput";

@InputType()
export class CreateUserInput {
  @Field()
  name: string;

  @Field()
  role: number;

  shibbolethID: string;
}
