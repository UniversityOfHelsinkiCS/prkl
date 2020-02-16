import { MigrationInterface, QueryRunner } from "typeorm";

export class AutogenerateCourseDateColumns1581867360072 implements MigrationInterface {
  name = "AutogenerateCourseDateColumns1581867360072";

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "reply" DROP CONSTRAINT "FK_f223d58bc40d2c56c122e6d4695"`, undefined);
    await queryRunner.query(`ALTER TABLE "reply" DROP CONSTRAINT "FK_7bcd351a43c3992d043baacc5ad"`, undefined);
    await queryRunner.query(`ALTER TABLE "reply" ALTER COLUMN "questionId" SET NOT NULL`, undefined);
    await queryRunner.query(`ALTER TABLE "reply" ALTER COLUMN "registrationId" SET NOT NULL`, undefined);
    await queryRunner.query(`ALTER TABLE "course" ALTER COLUMN "createdAt" SET DEFAULT now()`, undefined);
    await queryRunner.query(`ALTER TABLE "course" ALTER COLUMN "updatedAt" SET DEFAULT now()`, undefined);
    await queryRunner.query(
      `ALTER TABLE "reply" ADD CONSTRAINT "FK_f223d58bc40d2c56c122e6d4695" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "reply" ADD CONSTRAINT "FK_7bcd351a43c3992d043baacc5ad" FOREIGN KEY ("registrationId") REFERENCES "registration"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "reply" DROP CONSTRAINT "FK_7bcd351a43c3992d043baacc5ad"`, undefined);
    await queryRunner.query(`ALTER TABLE "reply" DROP CONSTRAINT "FK_f223d58bc40d2c56c122e6d4695"`, undefined);
    await queryRunner.query(`ALTER TABLE "course" ALTER COLUMN "updatedAt" DROP DEFAULT`, undefined);
    await queryRunner.query(`ALTER TABLE "course" ALTER COLUMN "createdAt" DROP DEFAULT`, undefined);
    await queryRunner.query(`ALTER TABLE "reply" ALTER COLUMN "registrationId" DROP NOT NULL`, undefined);
    await queryRunner.query(`ALTER TABLE "reply" ALTER COLUMN "questionId" DROP NOT NULL`, undefined);
    await queryRunner.query(
      `ALTER TABLE "reply" ADD CONSTRAINT "FK_7bcd351a43c3992d043baacc5ad" FOREIGN KEY ("registrationId") REFERENCES "registration"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "reply" ADD CONSTRAINT "FK_f223d58bc40d2c56c122e6d4695" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined,
    );
  }
}
