import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnHairStyleIdAndUserIdInTablePayment1731732162839 implements MigrationInterface {
    name = 'AddColumnHairStyleIdAndUserIdInTablePayment1731732162839'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" ADD "hair_style_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "user_id" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "hair_style_id"`);
    }

}
