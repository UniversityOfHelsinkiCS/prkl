import { Entity, Column, OneToMany, ManyToMany, BaseEntity, PrimaryGeneratedColumn } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Course } from "./Course";
import { Reply } from "./Reply";
import { Group } from "./Group";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // shibboleth userid
  @Field(() => String)
  @Column()
  shibbolethID: String;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => Number)
  @Column()
  role: number;

  @Field(() => [Course])
  @OneToMany(
    type => Course,
    course => course.teacher,
  )
  courses_teached: Course[];

  @Field(() => [Reply])
  @OneToMany(
    type => Reply,
    reply => reply.student,
  )
  replies_for_course: Reply[];

  @ManyToMany(
    type => Group,
    group => group.students,
  )
  groups: Group[];
}
