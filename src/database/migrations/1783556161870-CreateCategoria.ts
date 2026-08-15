import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCategoria1783556161870 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TABLE categorias(
            categoria_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            nome VARCHAR(100) NOT NULL);`
       );
      }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
