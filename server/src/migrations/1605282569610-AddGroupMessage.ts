import {MigrationInterface, QueryRunner} from "typeorm";

export class AddGroupMessage1605282569610 implements MigrationInterface {
    name = 'AddGroupMessage1605282569610'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "group" ADD "groupMessage" character varying`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "groupMessage"`, undefined);
    }

}
