import { Module } from '@nestjs/common';
import { CategoriaController } from './categoria.controller';
import { CategoriaService } from './categoria.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.enity';

@Module({
  imports: [TypeOrmModule.forFeature([Categoria])],
  controllers: [CategoriaController],
  providers: [CategoriaService]
})
export class CategoriaModule {}
