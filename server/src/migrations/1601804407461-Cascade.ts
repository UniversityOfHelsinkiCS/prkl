import {MigrationInterface, QueryRunner} from "typeorm";

export class Cascade1601804407461 implements MigrationInterface {
    name = 'Cascade1601804407461'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_106a115320f41bec8910c914eef"`, undefined);
        await queryRunner.query(`ALTER TABLE "course" ALTER COLUMN "published" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_106a115320f41bec8910c914eef" FOREIGN KEY ("registrationId") REFERENCES "registration"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_106a115320f41bec8910c914eef"`, undefined);
        await queryRunner.query(`ALTER TABLE "course" ALTER COLUMN "published" SET DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_106a115320f41bec8910c914eef" FOREIGN KEY ("registrationId") REFERENCES "registration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

}
