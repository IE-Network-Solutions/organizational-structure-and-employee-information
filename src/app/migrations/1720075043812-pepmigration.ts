import { MigrationInterface, QueryRunner } from 'typeorm';

export class Pepmigration1720075043812 implements MigrationInterface {
  name = 'Pepmigration1720075043812';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client_contact" DROP COLUMN "emailvjjj"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client_contact" ADD "emailvjjj" character varying(50)`,
    );
  }
}
