import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('produtos')

export class Produto{
    @PrimaryGeneratedColumn({name: 'produto_id'})
    produtoID!: number;

    @Column({ length: 100})
    nome!: string;

    @Column()
    descricao!: string;

    @Column({ length: 100})
    marca!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2})
    preco!: number;

    @Column({ default: 0})
    quantidade!: number;

    @Column({name: 'quantidade_min', default: 5})
    quantidadeMin!: number;

}