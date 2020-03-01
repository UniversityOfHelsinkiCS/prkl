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
