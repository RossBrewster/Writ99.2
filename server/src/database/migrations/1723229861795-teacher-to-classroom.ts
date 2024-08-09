import { MigrationInterface, QueryRunner } from "typeorm";

export class TeacherToClassroom1723229861795 implements MigrationInterface {
    name = 'TeacherToClassroom1723229861795'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assignment" ADD "prompt" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "student_submission" DROP CONSTRAINT "FK_24ec4583b2e1337c4e53ce46473"`);
        await queryRunner.query(`ALTER TABLE "student_submission" DROP CONSTRAINT "FK_0f9de20d251e7394818037d7c2f"`);
        await queryRunner.query(`ALTER TABLE "student_submission" ALTER COLUMN "assignmentId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "student_submission" ALTER COLUMN "studentId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "student_submission" ALTER COLUMN "submissionDate" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "classroom" DROP CONSTRAINT "FK_2b3c1fa62762d7d0e828c139130"`);
        await queryRunner.query(`ALTER TABLE "classroom" ALTER COLUMN "teacherId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "student_submission" ADD CONSTRAINT "FK_24ec4583b2e1337c4e53ce46473" FOREIGN KEY ("assignmentId") REFERENCES "assignment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student_submission" ADD CONSTRAINT "FK_0f9de20d251e7394818037d7c2f" FOREIGN KEY ("studentId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "classroom" ADD CONSTRAINT "FK_2b3c1fa62762d7d0e828c139130" FOREIGN KEY ("teacherId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "classroom" DROP CONSTRAINT "FK_2b3c1fa62762d7d0e828c139130"`);
        await queryRunner.query(`ALTER TABLE "student_submission" DROP CONSTRAINT "FK_0f9de20d251e7394818037d7c2f"`);
        await queryRunner.query(`ALTER TABLE "student_submission" DROP CONSTRAINT "FK_24ec4583b2e1337c4e53ce46473"`);
        await queryRunner.query(`ALTER TABLE "classroom" ALTER COLUMN "teacherId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "classroom" ADD CONSTRAINT "FK_2b3c1fa62762d7d0e828c139130" FOREIGN KEY ("teacherId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student_submission" ALTER COLUMN "submissionDate" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "student_submission" ALTER COLUMN "studentId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "student_submission" ALTER COLUMN "assignmentId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "student_submission" ADD CONSTRAINT "FK_0f9de20d251e7394818037d7c2f" FOREIGN KEY ("studentId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student_submission" ADD CONSTRAINT "FK_24ec4583b2e1337c4e53ce46473" FOREIGN KEY ("assignmentId") REFERENCES "assignment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "assignment" DROP COLUMN "prompt"`);
    }

}
