import { MigrationInterface, QueryRunner } from "typeorm";

export class InitModel1725567550394 implements MigrationInterface {
    name = 'InitModel1725567550394'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`barber\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0), \`updatedAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0), \`name\` varchar(255) NOT NULL, \`age\` int NOT NULL, \`description\` varchar(500) NOT NULL, \`img\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`barber\``);
    }

}
