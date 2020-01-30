import { Entity, PrimaryColumn, Column, OneToMany, ManyToMany } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Course } from "./Course";
import { Reply } from "./Reply"
import { Group } from "./Group"

@Entity()
export class User {
  // shibboleth userid
  @Field(() => ID)
  @PrimaryColumn()
  shibboletID: number;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => Number)
  @Column()
  role: number;

  @OneToMany(
    type => Course,
    course => course.teacher,
  )
  courses_teached: Course[];

  @OneToMany(type => Reply, reply => reply.student)
  replies_for_course: Reply[];

  @ManyToMany(type => Group, group => group.students)
  groups: Group[];
}
