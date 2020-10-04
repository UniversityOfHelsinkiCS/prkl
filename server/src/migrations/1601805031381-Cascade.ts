import {MigrationInterface, QueryRunner} from "typeorm";

export class Cascade1601805031381 implements MigrationInterface {
    name = 'Cascade1601805031381'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "workingTimes" DROP CONSTRAINT "FK_07c71e4f2797d8a5ae5a05ad5d6"`, undefined);
        await queryRunner.query(`ALTER TABLE "workingTimes" ADD CONSTRAINT "FK_07c71e4f2797d8a5ae5a05ad5d6" FOREIGN KEY ("registrationId") REFERENCES "registration"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "workingTimes" DROP CONSTRAINT "FK_07c71e4f2797d8a5ae5a05ad5d6"`, undefined);
        await queryRunner.query(`ALTER TABLE "workingTimes" ADD CONSTRAINT "FK_07c71e4f2797d8a5ae5a05ad5d6" FOREIGN KEY ("registrationId") REFERENCES "registration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

}
