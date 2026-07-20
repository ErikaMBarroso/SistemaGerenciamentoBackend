import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProduto1783556161870 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
        `CREATE TABLE produtos (
            produto_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            nome VARCHAR(100) NOT NULL
            CHECK (LENGTH(TRIM(nome)) >= 3),
            marca VARCHAR(100) NOT NULL,
            descricao TEXT,
            preco DECIMAL(10,2),
            ativo BOOLEAN NOT NULL DEFAULT true,
            quantidade INT NOT NULL DEFAULT 0 CHECK (quantidade >= 0),
            quantidade_min INT NOT NULL DEFAULT 5 CHECK (quantidade_min >= 0),
                
            categoria_id INT,
            FOREIGN KEY (categoria_id)
            REFERENCES categorias(categoria_id)
                );`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
