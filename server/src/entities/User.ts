import { Entity, Column, OneToMany, ManyToMany, BaseEntity, PrimaryGeneratedColumn } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Course } from "./Course";
import { Registration } from "./Registration";
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
  @Column({ default: "999999999", nullable: true })
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
  coursesTeached: Course[];

  @Field(type => [Registration])
  @OneToMany(
    type => Registration,
    registration => registration.student,
    { cascade: true },
  )
  registrations: Registration[];

  @Field(type => [Group])
  @ManyToMany(
    type => Group,
    group => group.students,
  )
  groups: Group[];
}
