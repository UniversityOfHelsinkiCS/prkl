import { MigrationInterface, QueryRunner } from "typeorm";

export class DoNotAllowSamePersonToEnrollToCourseMoreThanOnce1582799497363 implements MigrationInterface {
  name = "DoNotAllowSamePersonToEnrollToCourseMoreThanOnce1582799497363";

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "registration" ADD CONSTRAINT "FK_5e4665cc46ff4a681cc0e4cd783" UNIQUE ("courseId", "studentId")`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "registration" DROP CONSTRAINT "FK_5e4665cc46ff4a681cc0e4cd783"`, undefined);
  }
}
