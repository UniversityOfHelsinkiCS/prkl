import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRegistrationCreatedAtAndUpdatedAtColumns1581937430695 implements MigrationInterface {
  name = "AddRegistrationCreatedAtAndUpdatedAtColumns1581937430695";

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "registration" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "registration" ADD "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "registration" DROP COLUMN "updatedAt"`, undefined);
    await queryRunner.query(`ALTER TABLE "registration" DROP COLUMN "createdAt"`, undefined);
  }
}
