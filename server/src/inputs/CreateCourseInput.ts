import { InputType, Field } from "type-graphql";

@InputType()
export class CreateCourseInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  code: string;

  @Field()
  id: string;

  @Field()
  questions: string[];

  @Field()
  deadline: string;
}
