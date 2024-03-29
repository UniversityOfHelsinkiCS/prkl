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
  Unique,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

import { User } from "./User";
import { Course } from "./Course";
import { Answer } from "./Answer";
import { WorkingTimes } from "./WorkingTimes";

@ObjectType()
@Entity()
@Unique(["courseId", "student"])
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

  @Field(() => String)
  @Column({ nullable: true })
  studentId: string;

  @Field(() => Course)
  @ManyToOne(() => Course, (course) => course.registrations)
  @JoinColumn({ name: "courseId" })
  course: Course;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.registrations)
  @JoinColumn({ name: "studentId" })
  student: User;

  @Field(() => [Answer])
  @OneToMany(() => Answer, (answer) => answer.registration, { cascade: ["remove", "insert", "update"] })
  questionAnswers: Answer[];

  @Field(() => [WorkingTimes])
  @OneToMany(() => WorkingTimes, (workingTimes) => workingTimes.registration, {
    cascade: ["remove", "insert", "update"],
  })
  workingTimes: WorkingTimes[];
}
