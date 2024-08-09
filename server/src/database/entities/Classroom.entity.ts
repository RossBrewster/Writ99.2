import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { User } from "./User.entity";
import { Assignment } from "./Assignment.entity";

@Entity()
export class Classroom {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    teacherId: number;

    @ManyToOne(() => User, user => user.taughtClassrooms)
    teacher: User;

    @ManyToMany(() => User, user => user.enrolledClassrooms)
    @JoinTable()
    students: User[];

    @OneToMany(() => Assignment, assignment => assignment.classroom)
    assignments: Assignment[];
}