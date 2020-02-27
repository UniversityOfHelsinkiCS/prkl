import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1582033656005 implements MigrationInterface {
  name = "InitialMigration1582033656005";

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "registration" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "courseId" uuid NOT NULL, "studentId" uuid, CONSTRAINT "PK_cb23dc9d28df8801b15e9e2b8d6" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TABLE "group" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "courseId" uuid, CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "shibbolethUid" character varying NOT NULL, "role" integer NOT NULL DEFAULT 3, "firstname" character varying NOT NULL, "lastname" character varying NOT NULL, "studentNo" character varying, "email" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TABLE "course" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "deadline" TIMESTAMP WITH TIME ZONE NOT NULL, "code" character varying NOT NULL, "description" character varying, "maxGroupSize" integer NOT NULL, "minGroupSize" integer NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "teacherId" uuid, CONSTRAINT "PK_bf95180dd756fd204fb01ce4916" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TABLE "questionChoice" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying NOT NULL, "order" integer NOT NULL, "questionId" uuid, CONSTRAINT "PK_9991736672cae1a6fb1f4b6b4b1" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TABLE "question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying NOT NULL, "questionType" character varying NOT NULL, "rangeMin" integer, "rangeMax" integer, "order" integer NOT NULL, "courseId" uuid, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TABLE "answer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying, "questionId" uuid NOT NULL, "registrationId" uuid NOT NULL, CONSTRAINT "PK_9232db17b63fb1e94f97e5c224f" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TABLE "groupStudents" ("groupId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_b89a141cf412c75316dde4aebd9" PRIMARY KEY ("groupId", "userId"))`,
      undefined,
    );
    await queryRunner.query(`CREATE INDEX "IDX_bca67ac7824b2050a6e97275f2" ON "groupStudents" ("groupId") `, undefined);
    await queryRunner.query(`CREATE INDEX "IDX_4a317d5c4c38db54b08f56a46b" ON "groupStudents" ("userId") `, undefined);
    await queryRunner.query(
      `CREATE TABLE "answerChoice" ("answerId" uuid NOT NULL, "questionChoiceId" uuid NOT NULL, CONSTRAINT "PK_6a8a7b8d7bf46d3daeae9004d0d" PRIMARY KEY ("answerId", "questionChoiceId"))`,
      undefined,
    );
    await queryRunner.query(`CREATE INDEX "IDX_fa1b09790d3879996b4e003d44" ON "answerChoice" ("answerId") `, undefined);
    await queryRunner.query(
      `CREATE INDEX "IDX_5e4665cc46ff4a681cc0e4cd75" ON "answerChoice" ("questionChoiceId") `,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "registration" ADD CONSTRAINT "FK_7262963ece4889ee38507162807" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "registration" ADD CONSTRAINT "FK_6c992d9c3648892e1b553fb12ce" FOREIGN KEY ("studentId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "group" ADD CONSTRAINT "FK_39caf5d075ae8a8d384fda66951" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "course" ADD CONSTRAINT "FK_3e002f760e8099dd5796e5dc93b" FOREIGN KEY ("teacherId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "questionChoice" ADD CONSTRAINT "FK_109224e7385f86b8e642ba3e14f" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ADD CONSTRAINT "FK_694aa041ca01a3df5b7c4f2fff2" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" ADD CONSTRAINT "FK_a4013f10cd6924793fbd5f0d637" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" ADD CONSTRAINT "FK_106a115320f41bec8910c914eef" FOREIGN KEY ("registrationId") REFERENCES "registration"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "groupStudents" ADD CONSTRAINT "FK_bca67ac7824b2050a6e97275f2a" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "groupStudents" ADD CONSTRAINT "FK_4a317d5c4c38db54b08f56a46b5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "answerChoice" ADD CONSTRAINT "FK_fa1b09790d3879996b4e003d442" FOREIGN KEY ("answerId") REFERENCES "answer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "answerChoice" ADD CONSTRAINT "FK_5e4665cc46ff4a681cc0e4cd759" FOREIGN KEY ("questionChoiceId") REFERENCES "questionChoice"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ADD CONSTRAINT "FK_5e4665cc46ff4a681cc0e4cd751" UNIQUE ("courseId", "order")`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "questionChoice" ADD CONSTRAINT "FK_5e4665cc46ff4a681cc0e4cd752" UNIQUE ("questionId", "order")`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "answerChoice" DROP CONSTRAINT "FK_5e4665cc46ff4a681cc0e4cd759"`, undefined);
    await queryRunner.query(`ALTER TABLE "answerChoice" DROP CONSTRAINT "FK_fa1b09790d3879996b4e003d442"`, undefined);
    await queryRunner.query(`ALTER TABLE "groupStudents" DROP CONSTRAINT "FK_4a317d5c4c38db54b08f56a46b5"`, undefined);
    await queryRunner.query(`ALTER TABLE "groupStudents" DROP CONSTRAINT "FK_bca67ac7824b2050a6e97275f2a"`, undefined);
    await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_106a115320f41bec8910c914eef"`, undefined);
    await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_a4013f10cd6924793fbd5f0d637"`, undefined);
    await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_694aa041ca01a3df5b7c4f2fff2"`, undefined);
    await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_5e4665cc46ff4a681cc0e4cd751"`, undefined);
    await queryRunner.query(`ALTER TABLE "questionChoice" DROP CONSTRAINT "FK_109224e7385f86b8e642ba3e14f"`, undefined);
    await queryRunner.query(`ALTER TABLE "questionChoice" DROP CONSTRAINT "FK_5e4665cc46ff4a681cc0e4cd752"`, undefined);
    await queryRunner.query(`ALTER TABLE "course" DROP CONSTRAINT "FK_3e002f760e8099dd5796e5dc93b"`, undefined);
    await queryRunner.query(`ALTER TABLE "group" DROP CONSTRAINT "FK_39caf5d075ae8a8d384fda66951"`, undefined);
    await queryRunner.query(`ALTER TABLE "registration" DROP CONSTRAINT "FK_6c992d9c3648892e1b553fb12ce"`, undefined);
    await queryRunner.query(`ALTER TABLE "registration" DROP CONSTRAINT "FK_7262963ece4889ee38507162807"`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_5e4665cc46ff4a681cc0e4cd75"`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_fa1b09790d3879996b4e003d44"`, undefined);
    await queryRunner.query(`DROP TABLE "answerChoice"`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_4a317d5c4c38db54b08f56a46b"`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_bca67ac7824b2050a6e97275f2"`, undefined);
    await queryRunner.query(`DROP TABLE "groupStudents"`, undefined);
    await queryRunner.query(`DROP TABLE "answer"`, undefined);
    await queryRunner.query(`DROP TABLE "question"`, undefined);
    await queryRunner.query(`DROP TABLE "questionChoice"`, undefined);
    await queryRunner.query(`DROP TABLE "course"`, undefined);
    await queryRunner.query(`DROP TABLE "user"`, undefined);
    await queryRunner.query(`DROP TABLE "group"`, undefined);
    await queryRunner.query(`DROP TABLE "registration"`, undefined);
  }
}
