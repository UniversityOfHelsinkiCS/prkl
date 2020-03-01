import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSoftDeleteForCourse1582889320014 implements MigrationInterface {
  name = "AddSoftDeleteForCourse1582889320014";

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "course" ADD "deleted" boolean NOT NULL DEFAULT false`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "deleted"`, undefined);
  }
}
