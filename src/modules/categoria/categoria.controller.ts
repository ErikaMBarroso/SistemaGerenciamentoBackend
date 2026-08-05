import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CriaCategoria } from './dto/criaCategoria.dto';
import { AtualizaCategoria } from './dto/atualizaCategoria.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/role.guard';
import { Perfis } from '../auth/auth.decorator';

@ApiTags('categoria')
@ApiBearerAuth()
@Controller('categoria')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @Post()
  @ApiOperation({ summary: 'Cria categoria' })
  @Perfis('administrador')
  criaCategoria(@Body() dto: CriaCategoria) {
    return this.categoriaService.criaCategoria(dto);
  }

  @Get()
  @ApiOperation({ summary: 'consulta todas categoria' })
  @Perfis('administrador')
  consultaCategoria() {
    return this.categoriaService.consultaCategoria();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Cosnulta unica categoria' })
  @Perfis('administrador')
  consultaCategoriaUnica(@Param('id', ParseIntPipe) id: number) {
    return this.categoriaService.consultaUnicaCategoria(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza categoria' })
  @Perfis('administrador')
  atualizaCategoria(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizaCategoria,
  ) {
    return this.categoriaService.atualizaCategoria(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleta categoria' })
  @Perfis('administrador')
  deletaCategoria(@Param('id', ParseIntPipe) id: number) {
    return this.categoriaService.deletaCategoria(id);
  }
}
