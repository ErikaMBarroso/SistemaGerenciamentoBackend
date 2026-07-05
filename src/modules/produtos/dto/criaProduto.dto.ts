import { IsInt, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CriaProduto{

    @IsString()
    @MinLength(3)
    @MaxLength(100)
    nome!: string;

    @IsString()
    @IsOptional()
    descricao!: string;

    @IsString()
    @MaxLength(100)
    marca!: string;

    @IsNumber()
    @Min(0)
    preco!: number;

    @IsInt()
    @Min(0)
    quantidade!: number;

    @IsInt()
    @Min(0)
    quantidadeMin!: number;


}