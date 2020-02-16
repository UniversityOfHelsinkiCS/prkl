import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, JoinColumn } from "typeorm";
import { User } from "./User";
import { ObjectType, Field, ID } from "type-graphql";
import { Question } from "./Question";
import { Registration } from "./Registration";

@ObjectType()
@Entity()
export class Reply extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => Number)
  @Column({ nullable: true })
  value: number;

  @Field(() => String)
  @Column({ nullable: false })
  questionId: string;

  @Field(() => String)
  @Column({ nullable: false })
  registrationId: string;

  @Field(type => Question)
  @ManyToOne(
    type => Question,
    question => question.replies,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "questionId" })
  question: Question;

  @Field(type => Registration)
  @ManyToOne(
    type => Registration,
    registration => registration.questionReplies,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "registrationId" })
  registration: Registration;
}
