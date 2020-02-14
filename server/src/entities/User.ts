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
  @Column()
  shibbolethUid: string;

  @Field(() => Number)
  @Column()
  role: number;

  @Field(() => String)
  @Column()
  firstname: string;

  @Field(() => String)
  @Column()
  lastname: string;

  @Field(() => String, { nullable: true })
  @Column()
  studentNo: string;

  @Field(() => String)
  @Column()
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
