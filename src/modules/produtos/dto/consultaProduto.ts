import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MaxLength, Min, MinLength } from "class-validator";

export class ConsultaProduto{

    @IsOptional()
    @IsString()
    pesquisa!: string;

    @IsOptional()
    @IsIn(['nome', 'quantidade', 'preco', 'quantidadeMin'])
    ordem?: 'nome' | 'quantidade' | 'preco' | 'quantidadeMin' = 'nome';

    
    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    ordemBy?: 'ASC' | 'DESC' = 'ASC';

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    paginas?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    total?: number = 10;

}