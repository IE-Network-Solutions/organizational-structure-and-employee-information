import { MigrationInterface, QueryRunner } from 'typeorm';

export class Pepmigration1720074988964 implements MigrationInterface {
  name = 'Pepmigration1720074988964';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client_contact" RENAME COLUMN "emailv" TO "emailvjjj"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client_contact" RENAME COLUMN "emailvjjj" TO "emailv"`,
    );
  }
}
