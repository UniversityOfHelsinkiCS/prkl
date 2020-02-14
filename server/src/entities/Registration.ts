import { Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, BaseEntity } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

import { User } from "./User";
import { Course } from "./Course";
import { Reply } from "./Reply";

@ObjectType()
@Entity()
export class Registration extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(type => Course)
  @ManyToOne(
    type => Course,
    course => course.registrations,
    { eager: true },
  )
  course: Course;

  @Field(type => User)
  @ManyToOne(
    type => User,
    user => user.registrations,
  )
  student: User;

  @Field(type => [Reply])
  @OneToMany(
    type => Reply,
    reply => reply.registration,
  )
  questionReplies: Reply;
}
