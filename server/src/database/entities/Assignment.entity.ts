import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User.entity";
import { StudentSubmission } from "./StudentSubmission.entity";
import { RubricVersion } from "./RubricVersion.entity";
import { Classroom } from "./Classroom.entity";

@Entity()
export class Assignment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column("text")
    description: string;

    @Column("text")
    instructions: string;

    @Column("text", { nullable: true })
    readingMaterial: string;

    @Column()
    minimumDrafts: number;

    @Column()
    dueDate: Date;

    @ManyToOne(() => User, user => user.createdAssignments)
    createdBy: User;

    @ManyToOne(() => Classroom, classroom => classroom.assignments)
    classroom: Classroom;

    @OneToMany(() => StudentSubmission, submission => submission.assignment)
    submissions: StudentSubmission[];

    @OneToMany(() => RubricVersion, rubricVersion => rubricVersion.assignment)
    rubricVersions: RubricVersion[];
}