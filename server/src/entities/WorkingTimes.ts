import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, JoinColumn } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Registration } from "./Registration";
import { Question } from "./Question";

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

  @Field(type => Registration)
  @ManyToOne(
    type => Registration,
    registration => registration.workingTimes,
  )
  @JoinColumn({ name: "registrationId" })
  registration: Registration;

  @Field(type => Question)
  @ManyToOne(
    type => Question,
    question => question.workingTimes,
  )
  @JoinColumn({ name: "questionId" })
  timeQuestion: Question;
}
