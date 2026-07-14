import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsDateString, IsEnum, IsInt, Min } from "class-validator";

export class MovimentacaoDto{
    @ApiProperty({example: 'Seleciona: entrada ou saida'})
    @IsEnum(['entrada', 'saida'])
    tipo!: 'entrada' | 'saida';

    @ApiProperty({example: 'Seleciona quantidade que entra ou vai sair'})
    @IsInt()
    @Min(1)
    quantidade!: number;

    // @IsDateString()
    // dataMovimentacao!: string;

    @IsInt()
    produtoId!: number;

}