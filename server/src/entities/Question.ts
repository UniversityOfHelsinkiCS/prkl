import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, BaseEntity, Unique } from "typeorm";
import { Course } from "./Course";
import { Answer } from "./Answer";
import { ObjectType, Field, ID } from "type-graphql";
import { QuestionChoice } from "./QuestionChoice";
import { WorkingTimes } from "./WorkingTimes";

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

  @Field(type => Course)
  @ManyToOne(
    type => Course,
    course => course.questions,
    { onDelete: "CASCADE" },
  )
  course: Course;

  @Field(type => [QuestionChoice])
  @OneToMany(
    type => QuestionChoice,
    questionChoice => questionChoice.question,
    { cascade: true },
  )
  questionChoices: QuestionChoice[];

  @Field(type => [Answer])
  @OneToMany(
    type => Answer,
    answer => answer.question,
    { cascade: true, onDelete: "CASCADE" },
  )
  answers: Answer[];

  @Field(type => [WorkingTimes])
  @OneToMany(
    type => WorkingTimes,
    workingTimes => workingTimes.timeQuestion,
    { cascade: true, onDelete: "CASCADE" },
  )
  workingTimes: WorkingTimes[];
}
