import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from "typeorm";
import { User } from "./User";
import { ObjectType, Field, ID } from "type-graphql";
import { Question } from "./Question";

@ObjectType()
@Entity()
export class Reply extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => Number)
  @Column({ nullable: true })
  value: number;

  @ManyToOne(
    type => Question,
    question => question.replies,
    {onDelete:"CASCADE"}
  )
  question: Question;

  @ManyToOne(
    type => User,
    user => user.replies_for_course,
    {onDelete:"CASCADE"}
  )
  student: User;
}
