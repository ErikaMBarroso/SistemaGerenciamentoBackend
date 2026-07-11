import { IsDate, IsDateString, IsEnum, IsInt, Min } from "class-validator";

export class MovimentacaoDto{
    @IsEnum(['entrada', 'saida'])
    tipo!: 'entrada' | 'saida';

    @IsInt()
    @Min(1)
    quantidade!: number;

    @IsDateString()
    dataMovimentacao!: string;

    @IsInt()
    produtoId!: number;

}