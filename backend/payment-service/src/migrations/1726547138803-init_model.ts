import { MigrationInterface, QueryRunner } from "typeorm";

export class InitModel1726547138803 implements MigrationInterface {
    name = 'InitModel1726547138803'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."payment_status_enum" AS ENUM('SUCCESS', 'FAIL', 'PENDING')`);
        await queryRunner.query(`CREATE TYPE "public"."payment_type_enum" AS ENUM('VNPAY', 'MOMO')`);
        await queryRunner.query(`CREATE TABLE "payment" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP(0) NOT NULL DEFAULT ('now'::text)::timestamp(0) with time zone, "updatedAt" TIMESTAMP(0) NOT NULL DEFAULT ('now'::text)::timestamp(0) with time zone, "orderId" integer NOT NULL, "status" "public"."payment_status_enum" NOT NULL, "type" "public"."payment_type_enum" NOT NULL, "bank_code" character varying(50) NOT NULL, "pay_time" TIMESTAMP NOT NULL, "bank_tran_no" character varying(50) NOT NULL, CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "payment"`);
        await queryRunner.query(`DROP TYPE "public"."payment_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payment_status_enum"`);
    }

}
