// import { Produto } from "src/modules/produtos/entities/produto.entity";
// import { Usuario } from "src/modules/user/entities/user.entity";
// import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

// export class MovimentacaoEstoque{
// @PrimaryGeneratedColumn()
// id!: number;

// @Column()
// tipo!: 'entrada' | 'saida';

// @Column()
// quantidade!: number;

// @Column({name: 'data_movimentacao', type: 'timestamp'})
// dataMovimentacao!: Date;

// @ManyToOne(() => Produto, (produto) => produto.movimentacao)
// @JoinColumn({name: 'produto_id'})
// produto!: Produto;

// @Column({name: 'produto_id'})
// produtoId!: number;

// @ManyToOne(() => Usuario)
// @JoinColumn({ name: 'usuario_id'})
// usuario!: Usuario;


// @Column({ name: 'usuario_id'})
// usuarioId!: number;
// }