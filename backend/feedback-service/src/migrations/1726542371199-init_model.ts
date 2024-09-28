import { MigrationInterface, QueryRunner } from "typeorm";

export class InitModel1726542371199 implements MigrationInterface {
    name = 'InitModel1726542371199'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "feedback" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP(0) NOT NULL DEFAULT ('now'::text)::timestamp(0) with time zone, "updatedAt" TIMESTAMP(0) NOT NULL DEFAULT ('now'::text)::timestamp(0) with time zone, "comment" character varying(255) NOT NULL, "star" integer NOT NULL, "orderId" integer NOT NULL, "time" TIMESTAMP NOT NULL, CONSTRAINT "PK_8389f9e087a57689cd5be8b2b13" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "feedback"`);
    }

}
