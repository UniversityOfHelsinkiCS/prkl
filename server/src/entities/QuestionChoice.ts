import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, ManyToMany, Unique } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Question } from "./Question";
import { Answer } from "./Answer";

@ObjectType()
@Entity({ name: "questionChoice" })
@Unique(["question", "order"])
export class QuestionChoice extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column()
  content: string;

  @Field(() => Number)
  @Column()
  order: number;

  @Field(type => Question)
  @ManyToOne(
    type => Question,
    question => question.questionChoices,
  )
  question: Question;

  @Field(type => [Answer])
  @ManyToMany(
    type => Answer,
    answer => answer.answerChoices,
  )
  answers: Answer[];
}
