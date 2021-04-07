import { Entity, Column, OneToMany, ManyToMany, BaseEntity, PrimaryGeneratedColumn } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

import { Group } from "./Group";
import { Course } from "./Course";
import { Registration } from "./Registration";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // Shibboleth user id.
  @Field(() => String)
  @Column({ unique: true })
  shibbolethUid: string;

  @Field(() => Number)
  @Column({ default: 1 })
  role: number;

  @Field(() => String)
  @Column()
  firstname: string;

  @Field(() => String)
  @Column()
  lastname: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  studentNo: string;

  @Field(() => String)
  @Column()
  email: string;

  @Field(() => [Course])
  @ManyToMany(
    () => Course,
    course => course.teachers,
  )
  coursesTeached: Course[];

  @Field(() => [Registration])
  @OneToMany(
    () => Registration,
    registration => registration.student,
    { cascade: true },
  )
  registrations: Registration[];

  @Field(() => [Group])
  @ManyToMany(
    () => Group,
    group => group.students,
  )
  groups: Group[];
}
