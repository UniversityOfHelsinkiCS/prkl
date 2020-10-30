import {MigrationInterface, QueryRunner} from "typeorm";

export class AddPublishGroups1604070770944 implements MigrationInterface {
    name = 'AddPublishGroups1604070770944'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "course" ADD "groupsPublished" boolean NOT NULL DEFAULT false`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "groupsPublished"`, undefined);
    }

}
