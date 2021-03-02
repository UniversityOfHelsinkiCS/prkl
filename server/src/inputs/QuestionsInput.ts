import { InputType, Field } from "type-graphql";
import { AnswerInput } from "./AnswerInput";
import { QuestionChoiceInput } from "./QuestionChoiceInput";

@InputType()
export class QuestionsInput {
  @Field({ nullable: true })
  id: string;

  @Field()
  content: string;

  @Field()
  questionType: string;

  //rangeMin and rangeMax need to have a value if the questionChoices are ordered
  @Field({ nullable: true })
  rangeMin: number;

  @Field({ nullable: true })
  rangeMax: number;

  @Field()
  order: number;

  @Field()
  optional: boolean;

  @Field(type => [QuestionChoiceInput], { nullable: true })
  questionChoices: QuestionChoiceInput[];

  @Field(type => [AnswerInput], { nullable: true })
  answers: AnswerInput[];
}
