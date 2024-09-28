import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeNameForColumnOrderId1726632220304 implements MigrationInterface {
    name = 'ChangeNameForColumnOrderId1726632220304'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feedback" RENAME COLUMN "orderId" TO "order_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feedback" RENAME COLUMN "order_id" TO "orderId"`);
    }

}
