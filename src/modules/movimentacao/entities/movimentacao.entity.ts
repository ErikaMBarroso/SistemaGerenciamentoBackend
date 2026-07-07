import { Column, PrimaryGeneratedColumn } from "typeorm";
export class MovimentacaoEstoque{
@PrimaryGeneratedColumn()
id!: number;

@Column()
tipo!: 'entrada' | 'saida';

@Column()
quantidade!: number;

@Column({name: 'data_movimentacao'})
dataMovimentacao!: Date;

}