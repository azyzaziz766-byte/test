import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPhoneToUsers1784378165548 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE user
      ADD phone varchar(20) NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE user
      DROP COLUMN phone
    `);
  }
}
