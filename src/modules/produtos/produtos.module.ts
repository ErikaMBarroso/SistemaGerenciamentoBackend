import { Module } from '@nestjs/common';
import { ProdutosController } from './produtos.controller';
import { ProdutosService } from './produtos.service';
import { Produto } from './entities/produto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoria } from '../categoria/entities/categoria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Produto, Categoria])],
  controllers: [ProdutosController],
  providers: [ProdutosService]
})
export class ProdutosModule {}
