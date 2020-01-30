import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from "typeorm";
import { User } from "./User";
import { ObjectType, Field, ID } from "type-graphql";

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
  course_id: string;

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
  )
  teacher: User;
}
