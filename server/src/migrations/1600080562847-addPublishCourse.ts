import {MigrationInterface, QueryRunner} from "typeorm";

export class addPublishCourse1600080562847 implements MigrationInterface {
    name = 'addPublishCourse1600080562847'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "course" ADD "published" boolean NOT NULL DEFAULT false`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "published"`, undefined);
    }

}
