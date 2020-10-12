import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateCourseInput1602243776647 implements MigrationInterface {
    name = 'UpdateCourseInput1602243776647'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "workingTimes" DROP CONSTRAINT "FK_07c71e4f2797d8a5ae5a05ad5d6"`, undefined);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_106a115320f41bec8910c914eef"`, undefined);
        await queryRunner.query(`ALTER TABLE "workingTimes" ADD CONSTRAINT "FK_07c71e4f2797d8a5ae5a05ad5d6" FOREIGN KEY ("registrationId") REFERENCES "registration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_106a115320f41bec8910c914eef" FOREIGN KEY ("registrationId") REFERENCES "registration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_106a115320f41bec8910c914eef"`, undefined);
        await queryRunner.query(`ALTER TABLE "workingTimes" DROP CONSTRAINT "FK_07c71e4f2797d8a5ae5a05ad5d6"`, undefined);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_106a115320f41bec8910c914eef" FOREIGN KEY ("registrationId") REFERENCES "registration"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "workingTimes" ADD CONSTRAINT "FK_07c71e4f2797d8a5ae5a05ad5d6" FOREIGN KEY ("registrationId") REFERENCES "registration"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

}
