import {MigrationInterface, QueryRunner} from "typeorm";

export class CanAddCourseWorkingTimeLimits1646318249250 implements MigrationInterface {
    name = 'CanAddCourseWorkingTimeLimits1646318249250'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course" ADD "workTimeEndsAt" integer`);
        await queryRunner.query(`ALTER TABLE "course" ADD "weekends" boolean`);
        await queryRunner.query(`ALTER TABLE "course" ADD "minHours" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "minHours"`);
        await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "weekends"`);
        await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "workTimeEndsAt"`);
    }

}
