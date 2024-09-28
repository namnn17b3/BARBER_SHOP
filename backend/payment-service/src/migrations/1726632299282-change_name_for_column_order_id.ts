import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeNameForColumnOrderId1726632299282 implements MigrationInterface {
    name = 'ChangeNameForColumnOrderId1726632299282'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" RENAME COLUMN "orderId" TO "order_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" RENAME COLUMN "order_id" TO "orderId"`);
    }

}
