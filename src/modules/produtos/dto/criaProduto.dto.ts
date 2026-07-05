import { IsNumber, IsString } from "class-validator";

export class CriaProduto{

    @IsString()
    nome!: string;

    @IsString()
    descricao!: string;

    @IsString()
    marca!: string;

    @IsNumber()
    preco!: number;

    @IsNumber()
    quantidade!: number;

    @IsNumber()
    quantidadeMin!: number;


}