import {MigrationInterface, QueryRunner} from "typeorm";

export class CanChooseIfQuestionIsUsedInGroupCreation1614698634968 implements MigrationInterface {
    name = 'CanChooseIfQuestionIsUsedInGroupCreation1614698634968'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "question" ADD "useInGroupCreation" boolean NOT NULL DEFAULT true`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "useInGroupCreation"`, undefined);
    }

}
