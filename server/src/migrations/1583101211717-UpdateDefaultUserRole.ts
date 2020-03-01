import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateDefaultUserRole1583101211717 implements MigrationInterface {
    name = 'UpdateDefaultUserRole1583101211717'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 1`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 3`, undefined);
    }

}
