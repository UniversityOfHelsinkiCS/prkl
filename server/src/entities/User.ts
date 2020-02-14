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

  // Shibboleth user id.
  @Field(() => String)
  @Column({ default: "default shibb uid" })
  shibbolethUid: string;

  @Field(() => Number)
  @Column({ default: 3 })
  role: number;

  @Field(() => String)
  @Column({ default: "def firstname" })
  firstname: string;

  @Field(() => String)
  @Column({ default: "def lastname" })
  lastname: string;

  @Field(() => String, { nullable: true })
  @Column({ default: "999999999" })
  studentNo: string;

  @Field(() => String)
  @Column({ default: "defa email" })
  email: string;

  @Field(type => [Course])
  @OneToMany(
    type => Course,
    course => course.teacher,
    { cascade: true, eager: true },
  )
  courses_teached: Course[];

  @Field(type => [Reply])
  @OneToMany(
    type => Reply,
    reply => reply.student,
    { cascade: true },
  )
  replies_for_course: Reply[];

  @Field(type => [Group])
  @ManyToMany(
    type => Group,
    group => group.students,
  )
  groups: Group[];
}
