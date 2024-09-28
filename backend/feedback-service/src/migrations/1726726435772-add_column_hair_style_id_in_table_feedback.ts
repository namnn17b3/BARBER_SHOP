import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnHairStyleIdInTableFeedback1726726435772 implements MigrationInterface {
    name = 'AddColumnHairStyleIdInTableFeedback1726726435772'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feedback" ADD "hair_style_id" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feedback" DROP COLUMN "hair_style_id"`);
    }

}
