import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnAmountIntTablePayment1726559715594 implements MigrationInterface {
    name = 'AddColumnAmountIntTablePayment1726559715594'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" ADD "amount" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "amount"`);
    }

}
