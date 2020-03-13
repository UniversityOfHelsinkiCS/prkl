import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableWorkingTimes1584090568166 implements MigrationInterface {
  name = "CreateTableWorkingTimes1584090568166";

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "workingTimes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "startTime" TIMESTAMP WITH TIME ZONE NOT NULL, "endTime" TIMESTAMP WITH TIME ZONE NOT NULL, "registrationId" uuid NOT NULL, "timeQuestionId" uuid NOT NULL, CONSTRAINT "PK_7501a39ccd16b81f887c22d1d22" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "workingTimes" ADD CONSTRAINT "FK_07c71e4f2797d8a5ae5a05ad5d6" FOREIGN KEY ("registrationId") REFERENCES "registration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "workingTimes" ADD CONSTRAINT "FK_1602c02f6080370f201b193dff6" FOREIGN KEY ("timeQuestionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "workingTimes" DROP CONSTRAINT "FK_1602c02f6080370f201b193dff6"`, undefined);
    await queryRunner.query(`ALTER TABLE "workingTimes" DROP CONSTRAINT "FK_07c71e4f2797d8a5ae5a05ad5d6"`, undefined);
    await queryRunner.query(`DROP TABLE "workingTimes"`, undefined);
  }
}
