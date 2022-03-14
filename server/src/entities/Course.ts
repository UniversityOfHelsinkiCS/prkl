import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

import { User } from "./User";
import { Group } from "./Group";
import { Question } from "./Question";
import { Registration } from "./Registration";

@ObjectType()
@Entity()
export class Course extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column()
  title: string;

  @Field(() => Date)
  @Column("timestamptz")
  deadline: Date;

  @Field(() => String)
  @Column()
  code: string;

  @Field(() => String)
  @Column({ nullable: true })
  description: string;

  @Field(() => Number)
  @Column()
  maxGroupSize: number;

  @Field(() => Number)
  @Column()
  minGroupSize: number;

  @Field(() => Number, { nullable: true })
  @Column({ nullable: true })
  workTimeEndsAt: number;

  @Field(() => Boolean, { nullable: true })
  @Column({ nullable: true })
  weekends: boolean;

  @Field(() => Number, { nullable: true })
  @Column({ nullable: true })
  minHours: number;

  @Field(() => Boolean)
  @Column()
  published: boolean;

  @Field(() => Boolean)
  @Column({ default: false })
  groupsPublished: boolean;

  @Field(() => Boolean)
  @Column({ default: false })
  deleted: boolean;

  @Field(() => Date)
  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: "timestamptz", nullable: true })
  updatedAt: Date;

  @Field(() => [User])
  @ManyToMany(
    () => User,
    user => user.coursesTeached,
    { cascade: ["remove", "insert", "update"], onDelete: "CASCADE" },
  )
  @JoinTable({ name: "courseTeachers" })
  teachers: User[];

  @Field(() => [Question])
  @OneToMany(
    () => Question,
    question => question.course,
    { cascade: ["remove", "insert", "update"], onDelete: "CASCADE" },
  )
  questions: Question[];

  @Field(() => [Group])
  @OneToMany(
    () => Group,
    group => group.course,
    { cascade: ["remove", "insert", "update"], onDelete: "CASCADE" },
  )
  groups: Group[];

  @Field(() => [Registration])
  @OneToMany(
    () => Registration,
    registration => registration.course,
    { cascade: ["remove", "insert", "update"], onDelete: "CASCADE" },
  )
  registrations: Registration[];
}
