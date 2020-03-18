import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTentativeWorkingTimes1584532768325 implements MigrationInterface {
    name = 'AddTentativeWorkingTimes1584532768325'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "workingTimes" ADD "tentative" boolean NOT NULL DEFAULT false`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "workingTimes" DROP COLUMN "tentative"`, undefined);
    }

}
