import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('produtos')

export class Produto{
    @PrimaryGeneratedColumn({name: 'produto_id'})
    produtoID!: number;

    @Column()
    nome!: string;

    @Column()
    descricao!: string;

    @Column()
    marca!: string;

    @Column()
    preco!: number;

    @Column()
    quantidade!: number;

    @Column({name: 'quantidade_min'})
    quantidadeMin!: number;

}