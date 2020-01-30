import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import {User} from "./User"
import {Question} from "./Question"

@Entity()
export class Reply{

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    value: number;

    @ManyToOne(type => Question, question => question.replies)
    question: Question;

    @ManyToOne(type => User, user => user.replies_for_course)
    student: User;
}