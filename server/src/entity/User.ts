import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Course } from "./Course";

@Entity()
export class User {
  // shibboleth userid
  @Field(() => ID)
  @PrimaryColumn()
  shibboletID: number;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => Number)
  @Column()
  role: number;

  @OneToMany(
    type => Course,
    course => course.teacher,
  )
  courses_teached: Course[];
}
