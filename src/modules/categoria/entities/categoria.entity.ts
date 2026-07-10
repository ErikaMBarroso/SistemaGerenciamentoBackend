import { PrimaryGeneratedColumn , Column, Entity, OneToMany } from "typeorm";
import { Produto } from "../../produtos/entities/produto.entity";
@Entity('categorias')
export class Categoria{
    @PrimaryGeneratedColumn({  name: 'categoria_id'})
    categoriaId!: number;

    @Column()
    nome!: string;

    @OneToMany(() => Produto, (produto) => produto.categoria)
    produtos!: Produto[];
}