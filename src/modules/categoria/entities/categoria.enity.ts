import { Column, Entity, OneToMany } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm/browser";
import { Produto } from "../../produtos/entities/produto.entity";
@Entity('categorias')
export class Categoria{
    @PrimaryGeneratedColumn()
    CategoriaId!: number;

    @Column()
    nome!: string;

    @OneToMany(() => Produto, (produto) => produto.categoria)
    produtos!: Produto[];
}