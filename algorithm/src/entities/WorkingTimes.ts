import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, JoinColumn } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

import { Question } from "./Question";
import { Registration } from "./Registration";

@ObjectType()
@Entity({ name: "workingTimes" })
export class WorkingTimes extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => Date)
  @Column("timestamptz")
  startTime: Date;

  @Field(() => Date)
  @Column("timestamptz")
  endTime: Date;

  @Field(() => String)
  @Column({ nullable: false })
  registrationId: string;

  @Field(() => String)
  @Column({ nullable: false })
  questionId: string;

  @Field(() => Boolean)
  @Column({ nullable: false, default: false })
  tentative: boolean;

  @Field(() => Registration)
  @ManyToOne(
    () => Registration,
    registration => registration.workingTimes,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "registrationId" })
  registration: Registration;

  @Field(() => Question)
  @ManyToOne(
    () => Question,
    question => question.workingTimes,
  )
  @JoinColumn({ name: "questionId" })
  timeQuestion: Question;
}
