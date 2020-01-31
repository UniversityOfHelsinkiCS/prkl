import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, BaseEntity } from "typeorm";
import { Course } from "./Course";
import { Reply } from "./Reply";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
@Entity()
export class Question extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column()
  name: string;

  @ManyToOne(
    type => Course,
    course => course.questions,
  )
  course: Course;

  @OneToMany(
    type => Reply,
    reply => reply.question,
    { cascade: true, eager: true },
  )
  replies: Reply[];
}
