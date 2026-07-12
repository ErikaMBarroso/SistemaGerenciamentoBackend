import { Module } from '@nestjs/common';
import { MovimentacaoController } from './movimentacao.controller';
import { MovimentacaoService } from './movimentacao.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimentacaoEstoque } from './entities/movimentacao.entity';
import { Produto } from '../produtos/entities/produto.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([
    MovimentacaoEstoque,
    Produto,
  ]),],
  controllers: [MovimentacaoController],
  providers: [MovimentacaoService]
})
export class MovimentacaoModule {}
