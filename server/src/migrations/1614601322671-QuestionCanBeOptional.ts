import {MigrationInterface, QueryRunner} from "typeorm";

export class QuestionCanBeOptional1614601322671 implements MigrationInterface {
    name = 'QuestionCanBeOptional1614601322671'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "question" ADD "optional" boolean NOT NULL DEFAULT false`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "optional"`, undefined);
    }

}
