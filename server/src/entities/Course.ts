import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  OneToMany,
  Timestamp,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

import { User } from "./User";
import { Question } from "./Question";
import { Group } from "./Group";
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

  @Field(() => Boolean)
  @Column()
  published: boolean;

  @Field(() => Boolean)
  @Column({ default: false })
  deleted: boolean;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz", nullable: true })
  updatedAt: Date;

  @Field(type => User)
  @ManyToOne(
    type => User,
    user => user.coursesTeached,
  )
  teacher: User;

  @Field(type => [Question])
  @OneToMany(
    type => Question,
    question => question.course,
    { cascade: ["remove", "insert", "update"], onDelete: "CASCADE" },
  )
  questions: Question[];

  @Field(type => [Group])
  @OneToMany(
    type => Group,
    group => group.course,
    { cascade: ["remove", "insert", "update"], onDelete: "CASCADE" },
  )
  groups: Group[];

  @Field(type => [Registration])
  @OneToMany(
    type => Registration,
    registration => registration.course,
    { cascade: ["remove", "insert", "update"], onDelete: "CASCADE" },
  )
  registrations: Registration[];
}
