import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Assignment } from "./Assignment.entity";
import { User } from "./User.entity";
import { Feedback } from "./Feedback.entity";

@Entity()
export class StudentSubmission {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Assignment, assignment => assignment.submissions)
    assignment: Assignment;

    @ManyToOne(() => User)
    student: User;

    @Column()
    draftNumber: number;

    @Column("text")
    content: string;

    @Column()
    submissionDate: Date;

    @OneToMany(() => Feedback, feedback => feedback.submission)
    feedback: Feedback[];
}