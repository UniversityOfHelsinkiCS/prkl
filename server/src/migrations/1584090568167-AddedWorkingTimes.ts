import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedWorkingTimes1584090568167 implements MigrationInterface {
    name = 'AddedWorkingTimes1584090568167'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "workingTimes" DROP CONSTRAINT "FK_1602c02f6080370f201b193dff6"`, undefined);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_a4013f10cd6924793fbd5f0d637"`, undefined);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_106a115320f41bec8910c914eef"`, undefined);
        await queryRunner.query(`ALTER TABLE "workingTimes" RENAME COLUMN "timeQuestionId" TO "questionId"`, undefined);
        await queryRunner.query(`ALTER TABLE "workingTimes" ADD CONSTRAINT "FK_c05be1008e0a9c3f52f3612a806" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_a4013f10cd6924793fbd5f0d637" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_106a115320f41bec8910c914eef" FOREIGN KEY ("registrationId") REFERENCES "registration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_106a115320f41bec8910c914eef"`, undefined);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_a4013f10cd6924793fbd5f0d637"`, undefined);
        await queryRunner.query(`ALTER TABLE "workingTimes" DROP CONSTRAINT "FK_c05be1008e0a9c3f52f3612a806"`, undefined);
        await queryRunner.query(`ALTER TABLE "workingTimes" RENAME COLUMN "questionId" TO "timeQuestionId"`, undefined);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_106a115320f41bec8910c914eef" FOREIGN KEY ("registrationId") REFERENCES "registration"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_a4013f10cd6924793fbd5f0d637" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "workingTimes" ADD CONSTRAINT "FK_1602c02f6080370f201b193dff6" FOREIGN KEY ("timeQuestionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

}
