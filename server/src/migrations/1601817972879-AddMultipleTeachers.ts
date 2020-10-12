import {MigrationInterface, QueryRunner} from "typeorm";

export class AddMultipleTeachers1601817972879 implements MigrationInterface {
    name = 'AddMultipleTeachers1601817972879'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "course" DROP CONSTRAINT "FK_3e002f760e8099dd5796e5dc93b"`, undefined);
        await queryRunner.query(`CREATE TABLE "courseTeachers" ("courseId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_08abe3d8b688392337a9adf5426" PRIMARY KEY ("courseId", "userId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_73e484cd8e126e6e4169259075" ON "courseTeachers" ("courseId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_1e17c0f6fbd017563ae4fc3bae" ON "courseTeachers" ("userId") `, undefined);
        await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "teacherId"`, undefined);
        await queryRunner.query(`ALTER TABLE "course" ALTER COLUMN "published" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "courseTeachers" ADD CONSTRAINT "FK_73e484cd8e126e6e41692590755" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "courseTeachers" ADD CONSTRAINT "FK_1e17c0f6fbd017563ae4fc3bae8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "courseTeachers" DROP CONSTRAINT "FK_1e17c0f6fbd017563ae4fc3bae8"`, undefined);
        await queryRunner.query(`ALTER TABLE "courseTeachers" DROP CONSTRAINT "FK_73e484cd8e126e6e41692590755"`, undefined);
        await queryRunner.query(`ALTER TABLE "course" ALTER COLUMN "published" SET DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "course" ADD "teacherId" uuid`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_1e17c0f6fbd017563ae4fc3bae"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_73e484cd8e126e6e4169259075"`, undefined);
        await queryRunner.query(`DROP TABLE "courseTeachers"`, undefined);
        await queryRunner.query(`ALTER TABLE "course" ADD CONSTRAINT "FK_3e002f760e8099dd5796e5dc93b" FOREIGN KEY ("teacherId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

}
