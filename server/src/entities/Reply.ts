import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from "typeorm";
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

  @Field(type => Question)
  @ManyToOne(
    type => Question,
    question => question.replies,
    { onDelete: "CASCADE" },
  )
  question: Question;

  @Field(type => Registration)
  @ManyToOne(
    type => Registration,
    registration => registration.questionReplies,
    { onDelete: "CASCADE" },
  )
  registration: Registration;
}
