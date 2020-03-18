import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTentativeWorkingTimes1584528902378 implements MigrationInterface {
    name = 'AddTentativeWorkingTimes1584528902378'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "workingTimes" ADD "tentative" boolean NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "workingTimes" DROP COLUMN "tentative"`, undefined);
    }

}
