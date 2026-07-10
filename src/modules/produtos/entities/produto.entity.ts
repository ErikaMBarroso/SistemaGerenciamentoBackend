import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Categoria } from "../../categoria/entities/categoria.enity";
@Entity('produtos')

export class Produto{
    @PrimaryGeneratedColumn({name: 'produto_id'})
    produtoID!: number;

    @Column({ length: 100})
    nome!: string;

    @Column({type: 'text'})
    descricao!: string;

    @Column({ length: 100})
    marca!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2})
    preco!: number;

    @Column({ default: 0})
    quantidade!: number;

    @Column({name: 'quantidade_min', default: 5})
    quantidadeMin!: number;

    @ManyToOne(() => Categoria, (categoria) => categoria.produtos)
    @JoinColumn({ name: 'categoria_id'})
    categoria!: Categoria;



    @Column({  name: 'categoria_id'})
    categoriaId!: number;


}