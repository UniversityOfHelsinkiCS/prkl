import { Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, BaseEntity } from "typeorm";
import { Course } from "./Course";
import { User } from "./User";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
@Entity()
export class Group extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(
    type => Course,
    course => course.groups,
  )
  course: Course;

  @ManyToMany(
    type => User,
    user => user.groups,
  )
  @JoinTable()
  students: User[];
}
