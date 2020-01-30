import {Entity, PrimaryColumn, Column, OneToMany} from "typeorm";
import {Course} from "./Course"

@Entity()
export class User {

    // shibboleth userid
    @PrimaryColumn()
    shibboletID: number;

    @Column()
    name: string;

    @Column()
    role: number;

    @OneToMany(type => Course, course => course.teacher)
    courses_teached: Course[];
}
