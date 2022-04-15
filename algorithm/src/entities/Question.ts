import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, BaseEntity, Unique } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

import { Course } from "./Course";
import { Answer } from "./Answer";
import { WorkingTimes } from "./WorkingTimes";
import { QuestionChoice } from "./QuestionChoice";

@ObjectType()
@Entity()
@Unique(["course", "order"])
export class Question extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column()
  content: string;

  @Field(() => String)
  @Column()
  questionType: string;

  @Field(() => Number)
  @Column({ nullable: true })
  rangeMin: number;

  @Field(() => Number)
  @Column({ nullable: true })
  rangeMax: number;

  @Field(() => Number)
  @Column()
  order: number;

  @Field(() => Boolean)
  @Column({ default: false })
  optional: boolean;

  @Field(() => Boolean)
  @Column({ default: true })
  useInGroupCreation: boolean;

  @Field(() => Course)
  @ManyToOne(() => Course, (course) => course.questions, { onDelete: "CASCADE" })
  course: Course;

  @Field(() => [QuestionChoice])
  @OneToMany(() => QuestionChoice, (questionChoice) => questionChoice.question, { cascade: true })
  questionChoices: QuestionChoice[];

  @Field(() => [Answer])
  @OneToMany(() => Answer, (answer) => answer.question, { cascade: true, onDelete: "CASCADE" })
  answers: Answer[];

  @Field(() => [WorkingTimes])
  @OneToMany(() => WorkingTimes, (workingTimes) => workingTimes.timeQuestion, { cascade: true, onDelete: "CASCADE" })
  workingTimes: WorkingTimes[];
}
