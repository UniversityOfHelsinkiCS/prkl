import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  BaseEntity,
  Column,
  JoinColumn,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

import { Course } from "./Course";
import { User } from "./User";

@ObjectType()
@Entity()
export class Group extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column({ nullable: true })
  courseId: string;

  @Field(() => String)
  @Column({ nullable: true })
  groupName: string;

  @Field(() => String)
  @Column({ nullable: true })
  groupMessage: string;

  @Field(() => Course)
  @ManyToOne(() => Course, (course) => course.groups)
  @JoinColumn({ name: "courseId" })
  course: Course;

  @Field(() => [User])
  @ManyToMany(() => User, (user) => user.groups)
  @JoinTable({ name: "groupStudents" })
  students: User[];
}
