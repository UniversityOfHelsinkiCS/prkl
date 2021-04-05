import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

import { Question } from "./Question";
import { Registration } from "./Registration";
import { QuestionChoice } from "./QuestionChoice";

@ObjectType()
@Entity()
export class Answer extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  content: string;

  @Field(() => String)
  @Column({ nullable: false })
  questionId: string;

  @Field(() => String)
  @Column({ nullable: false })
  registrationId: string;

  @Field(() => Question)
  @ManyToOne(
    () => Question,
    question => question.answers,
  )
  @JoinColumn({ name: "questionId" })
  question: Question;

  @Field(() => Registration)
  @ManyToOne(
    () => Registration,
    registration => registration.questionAnswers,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "registrationId" })
  registration: Registration;

  @Field(() => [QuestionChoice])
  @ManyToMany(
    () => QuestionChoice,
    questionChoice => questionChoice.answers,
    { cascade: ["update"] },
  )
  @JoinTable({ name: "answerChoice" })
  answerChoices: QuestionChoice[];
}
