import { Module } from '@nestjs/common';
import { MovimentacaoController } from './movimentacao.controller';
import { MovimentacaoService } from './movimentacao.service';

@Module({
  controllers: [MovimentacaoController],
  providers: [MovimentacaoService]
})
export class MovimentacaoModule {}
