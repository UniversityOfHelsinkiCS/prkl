import {MigrationInterface, QueryRunner} from "typeorm";

export class AddDatesToCourse1581756216757 implements MigrationInterface {
    name = 'AddDatesToCourse1581756216757'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "course" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "course" ADD "updatedAt" TIMESTAMP WITH TIME ZONE`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "shibbolethUid" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "firstname" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "lastname" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "studentNo" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "course" ALTER COLUMN "description" DROP NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "course" ALTER COLUMN "description" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" SET DEFAULT 'defa email'`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "studentNo" SET DEFAULT '999999999'`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "lastname" SET DEFAULT 'def lastname'`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "firstname" SET DEFAULT 'def firstname'`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "shibbolethUid" SET DEFAULT 'default shibb uid'`, undefined);
        await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "updatedAt"`, undefined);
        await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "createdAt"`, undefined);
    }

}
