import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  BaseEntity,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

import { User } from "./User";
import { Course } from "./Course";
import { Answer } from "./Answer";

@ObjectType()
@Entity()
export class Registration extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz", nullable: true })
  updatedAt: Date;

  @Field(() => String)
  @Column({ nullable: false })
  courseId: string;

  @Field(type => Course)
  @ManyToOne(
    type => Course,
    course => course.registrations,
    { eager: true },
  )
  @JoinColumn({ name: "courseId" })
  course: Course;

  @Field(type => User)
  @ManyToOne(
    type => User,
    user => user.registrations,
  )
  student: User;

  @Field(type => [Answer])
  @OneToMany(
    type => Answer,
    answer => answer.registration,
    { cascade: ["remove", "insert", "update"] },
  )
  questionAnswers: Answer[];
}
