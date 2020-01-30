import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import {User} from "./User"

@Entity()
export class Course {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string; 
    
    @Column()
    course_id: string;
    
    @Column()
    description: string;
    
    @Column()
    max_group_size: number;
    
    @Column()
    min_group_size: number;

    @ManyToOne(type => User, user => user.courses_teached)
    teacher: User; 
}