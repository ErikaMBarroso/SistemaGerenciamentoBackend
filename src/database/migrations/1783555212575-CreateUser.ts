import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUser1783555212575 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
      CREATE TABLE usuario (
        usuario_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        senha VARCHAR(255) NOT NULL,
        perfil VARCHAR(20) NOT NULL 
          CHECK (perfil IN ('administrador', 'financeiro'))
      );`
            
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

    }

}
