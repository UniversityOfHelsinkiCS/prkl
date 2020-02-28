/**
 * N.B.:
 * Some unique constraints were added manually in earlier migrations without adding
 * them to TypeORM entity files, too. This caused TypeORM to always try to revert them
 * when migrations were auto-generated. This migration and commit fix the issue.
 * However, for some reason TypeORM wants to drop them first and then generate its own
 * constraints. Do let it be.
 */
import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUniqueConstraintToShibbolethUid1582914681735 implements MigrationInterface {
    name = 'AddUniqueConstraintToShibbolethUid1582914681735'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "registration" DROP CONSTRAINT "FK_5e4665cc46ff4a681cc0e4cd783"`, undefined);
        await queryRunner.query(`ALTER TABLE "questionChoice" DROP CONSTRAINT "FK_5e4665cc46ff4a681cc0e4cd752"`, undefined);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_5e4665cc46ff4a681cc0e4cd751"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_7378c19801a91806150962de101" UNIQUE ("shibbolethUid")`, undefined);
        await queryRunner.query(`ALTER TABLE "registration" ADD CONSTRAINT "UQ_078e48fe71f42774654baa11d10" UNIQUE ("courseId", "studentId")`, undefined);
        await queryRunner.query(`ALTER TABLE "questionChoice" ADD CONSTRAINT "UQ_013a8ed2eb46d922495c7d631fd" UNIQUE ("questionId", "order")`, undefined);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "UQ_3eef4f1d67f403197df05979166" UNIQUE ("courseId", "order")`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "UQ_3eef4f1d67f403197df05979166"`, undefined);
        await queryRunner.query(`ALTER TABLE "questionChoice" DROP CONSTRAINT "UQ_013a8ed2eb46d922495c7d631fd"`, undefined);
        await queryRunner.query(`ALTER TABLE "registration" DROP CONSTRAINT "UQ_078e48fe71f42774654baa11d10"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_7378c19801a91806150962de101"`, undefined);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_5e4665cc46ff4a681cc0e4cd751" UNIQUE ("order", "courseId")`, undefined);
        await queryRunner.query(`ALTER TABLE "questionChoice" ADD CONSTRAINT "FK_5e4665cc46ff4a681cc0e4cd752" UNIQUE ("order", "questionId")`, undefined);
        await queryRunner.query(`ALTER TABLE "registration" ADD CONSTRAINT "FK_5e4665cc46ff4a681cc0e4cd783" UNIQUE ("courseId", "studentId")`, undefined);
    }

}
