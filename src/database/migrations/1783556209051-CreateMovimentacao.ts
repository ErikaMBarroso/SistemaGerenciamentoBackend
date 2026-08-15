import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMovimentacao1783556209051 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
        `CREATE TABLE movimentacoes (
            id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('entrada', 'saida')),
            quantidade INT NOT NULL,
            data_movimentacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            produto_id INT NOT NULL,
            usuario_id INT NOT NULL,

                
            FOREIGN KEY (produto_id)
            REFERENCES produtos(produto_id),
                
                
            FOREIGN KEY (usuario_id)
            REFERENCES usuario(usuario_id)
);`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
