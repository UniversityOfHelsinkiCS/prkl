import { Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, BaseEntity } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Course } from "./Course";
import { User } from "./User";

@ObjectType()
@Entity()
export class Group extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(type => Course)
  @ManyToOne(
    type => Course,
    course => course.groups,
  )
  course: Course;

  @Field(type => [User])
  @ManyToMany(
    type => User,
    user => user.groups,
  )
  @JoinTable({ name: "groupStudents" })
  students: User[];
}
