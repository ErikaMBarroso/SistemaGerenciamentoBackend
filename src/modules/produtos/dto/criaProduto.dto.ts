import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNumber, IsOptional, IsPositive, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CriaProduto{

    @ApiProperty({example: 'Ração', minLength: 3, maxLength: 100})
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    nome!: string;

    @ApiProperty({example: 'Ração para cachorro'})
    @IsString()
    descricao!: string;

    @ApiProperty({ example: 'GoldeN', maxLength: 100})
    @IsString()
    @MaxLength(100)
    marca!: string;

    @Type(() => Number)
    @ApiProperty({example: 29.99})
    @IsNumber()
    @Min(0)
    preco!: number;

    @ApiProperty({ example: 10})
    @IsInt()
    @Min(0)
    quantidade!: number;

    @ApiProperty({ example: 5})
    @IsInt()
    @Min(0)
    quantidadeMin!: number;

    @IsInt()
    @IsPositive()
    categoriaId!: number;
}