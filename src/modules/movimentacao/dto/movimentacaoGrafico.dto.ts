import { IsIn, IsOptional } from 'class-validator';

export class PeriodoGrafico {
  @IsOptional()
  @IsIn(['7dias', '30dias', '3meses', '1ano'])
  periodo?: '7dias' | '30dias' | '3meses' | '1ano' = '30dias';
}
