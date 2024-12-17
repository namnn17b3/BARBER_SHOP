import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveColumnStatusInTablePayment1734426969118 implements MigrationInterface {
    name = 'RemoveColumnStatusInTablePayment1734426969118'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."payment_status_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."payment_status_enum" AS ENUM('SUCCESS', 'FAIL', 'PENDING')`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "status" "public"."payment_status_enum" NOT NULL`);
    }

}
