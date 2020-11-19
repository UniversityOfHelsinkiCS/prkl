import {MigrationInterface, QueryRunner} from "typeorm";

export class AddGroupName1605803972909 implements MigrationInterface {
    name = 'AddGroupName1605803972909'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "group" ADD "groupName" character varying`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "groupName"`, undefined);
    }

}
