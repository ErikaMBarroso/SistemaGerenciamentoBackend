import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { ProdutosModule } from '../produtos/produtos.module';
import { MovimentacaoModule } from '../movimentacao/movimentacao.module';
import { CategoriaModule } from '../categoria/categoria.module';

@Module({
  imports: [ProdutosModule, MovimentacaoModule, CategoriaModule],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
