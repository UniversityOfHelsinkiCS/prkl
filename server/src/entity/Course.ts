import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, OneToMany } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

import { User } from "./User";
import { Question } from "./Question";
import { Group } from "./Group";

@ObjectType()
@Entity()
export class Course extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column()
  title: string;

  @Field(() => String)
  @Column()
  deadline: string;

  @Field(() => String)
  @Column()
  code: string;

  @Field(() => String)
  @Column()
  description: string;

  @Field(() => Number)
  @Column()
  max_group_size: number;

  @Field(() => Number)
  @Column()
  min_group_size: number;

  @ManyToOne(
    type => User,
    user => user.courses_teached,
    {onDelete:"CASCADE"}
  )
  teacher: User;

  @Field(type => [Question])
  @OneToMany(
    type => Question,
    question => question.course,
    { cascade: ["remove", "insert", "update"], eager: true, onDelete:"CASCADE" },
  )
  questions: Question[];

  @Field(type => [Group])
  @OneToMany(
    type => Group,
    group => group.course,
    { cascade: ["remove", "insert", "update"], eager: true, onDelete:"CASCADE" },
  )
  groups: Group[];
}
