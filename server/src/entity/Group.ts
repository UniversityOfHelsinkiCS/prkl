import { Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { Course } from "./Course"
import { User} from "./User"

@Entity()
export class Group{

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(type => Course, course => course.groups)
    course: Course;

    @ManyToMany(type => User, user => user.groups)
    @JoinTable()
    students: User[];
}