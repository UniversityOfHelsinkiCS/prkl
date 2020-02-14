import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigration1581693228139 implements MigrationInterface {
    name = 'InitialMigration1581693228139'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying NOT NULL, "courseId" uuid, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "reply" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" integer, "questionId" uuid, "registrationId" uuid, CONSTRAINT "PK_94fa9017051b40a71e000a2aff9" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "registration" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "courseId" uuid, "studentId" uuid, CONSTRAINT "PK_cb23dc9d28df8801b15e9e2b8d6" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "group" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "courseId" uuid, CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "shibbolethUid" character varying NOT NULL DEFAULT 'default shibb uid', "role" integer NOT NULL DEFAULT 3, "firstname" character varying NOT NULL DEFAULT 'def firstname', "lastname" character varying NOT NULL DEFAULT 'def lastname', "studentNo" character varying DEFAULT '999999999', "email" character varying NOT NULL DEFAULT 'defa email', CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "course" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "deadline" TIMESTAMP WITH TIME ZONE NOT NULL, "code" character varying NOT NULL, "description" character varying NOT NULL, "maxGroupSize" integer NOT NULL, "minGroupSize" integer NOT NULL, "teacherId" uuid, CONSTRAINT "PK_bf95180dd756fd204fb01ce4916" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "group_students_user" ("groupId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_dec7aa801c508ce647f7ead80ef" PRIMARY KEY ("groupId", "userId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_ba3ddb25fe3cf6ba5c216d33cd" ON "group_students_user" ("groupId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_546b43b38d962b70082a1150bf" ON "group_students_user" ("userId") `, undefined);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_694aa041ca01a3df5b7c4f2fff2" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "reply" ADD CONSTRAINT "FK_f223d58bc40d2c56c122e6d4695" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "reply" ADD CONSTRAINT "FK_7bcd351a43c3992d043baacc5ad" FOREIGN KEY ("registrationId") REFERENCES "registration"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "registration" ADD CONSTRAINT "FK_7262963ece4889ee38507162807" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "registration" ADD CONSTRAINT "FK_6c992d9c3648892e1b553fb12ce" FOREIGN KEY ("studentId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "group" ADD CONSTRAINT "FK_39caf5d075ae8a8d384fda66951" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "course" ADD CONSTRAINT "FK_3e002f760e8099dd5796e5dc93b" FOREIGN KEY ("teacherId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "group_students_user" ADD CONSTRAINT "FK_ba3ddb25fe3cf6ba5c216d33cdc" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "group_students_user" ADD CONSTRAINT "FK_546b43b38d962b70082a1150bfc" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "group_students_user" DROP CONSTRAINT "FK_546b43b38d962b70082a1150bfc"`, undefined);
        await queryRunner.query(`ALTER TABLE "group_students_user" DROP CONSTRAINT "FK_ba3ddb25fe3cf6ba5c216d33cdc"`, undefined);
        await queryRunner.query(`ALTER TABLE "course" DROP CONSTRAINT "FK_3e002f760e8099dd5796e5dc93b"`, undefined);
        await queryRunner.query(`ALTER TABLE "group" DROP CONSTRAINT "FK_39caf5d075ae8a8d384fda66951"`, undefined);
        await queryRunner.query(`ALTER TABLE "registration" DROP CONSTRAINT "FK_6c992d9c3648892e1b553fb12ce"`, undefined);
        await queryRunner.query(`ALTER TABLE "registration" DROP CONSTRAINT "FK_7262963ece4889ee38507162807"`, undefined);
        await queryRunner.query(`ALTER TABLE "reply" DROP CONSTRAINT "FK_7bcd351a43c3992d043baacc5ad"`, undefined);
        await queryRunner.query(`ALTER TABLE "reply" DROP CONSTRAINT "FK_f223d58bc40d2c56c122e6d4695"`, undefined);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_694aa041ca01a3df5b7c4f2fff2"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_546b43b38d962b70082a1150bf"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_ba3ddb25fe3cf6ba5c216d33cd"`, undefined);
        await queryRunner.query(`DROP TABLE "group_students_user"`, undefined);
        await queryRunner.query(`DROP TABLE "course"`, undefined);
        await queryRunner.query(`DROP TABLE "user"`, undefined);
        await queryRunner.query(`DROP TABLE "group"`, undefined);
        await queryRunner.query(`DROP TABLE "registration"`, undefined);
        await queryRunner.query(`DROP TABLE "reply"`, undefined);
        await queryRunner.query(`DROP TABLE "question"`, undefined);
    }

}
