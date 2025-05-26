import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserPhone1748175572787 implements MigrationInterface {
    name = 'AddUserPhone1748175572787'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
    }

}
