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

  // @ManyToOne(
  //   type => User,
  //   user => user.courses_teached,
  // )
  // teacher: User;

  @Field(type => [Question])
  @OneToMany(
    type => Question,
    question => question.course,
    { cascade: true, eager: true },
  )
  questions: Question[];

  // @OneToMany(
  //   type => Group,
  //   group => group.course,
  // )
  // groups: Group[];
}
