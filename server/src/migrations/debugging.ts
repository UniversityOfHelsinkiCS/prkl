import {MigrationInterface, QueryRunner} from "typeorm";

export class PostRefactoringTIMESTAMP implements MigrationInterface {

  async up(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(`create extension "uuid-ossp";`);
    queryRunner.query("select uuid_generate_v4();");
  }

  async down(queryRunner: QueryRunner): Promise<any> { 

  }


}