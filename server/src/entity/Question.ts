// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
// import { Course } from "./Course";
// import { Reply } from "./Reply";

// @Entity()
// export class Question {
//   @PrimaryGeneratedColumn("uuid")
//   id: string;

//   @Column()
//   name: string;

//   // @ManyToOne(type => Course, course => course.questions)
//   // course: Course;

//   @OneToMany(
//     type => Reply,
//     reply => reply.question,
//   )
//   replies: Reply[];
// }
