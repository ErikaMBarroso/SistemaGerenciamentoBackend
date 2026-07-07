import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/role.guard';
import { ProdutosService } from './produtos.service';
import { Perfis } from '../auth/auth.decorator';
import { CriaProduto } from './dto/criaProduto.dto';
import { AtualizaProduto } from './dto/atualizaProduto.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('produto')
@ApiBearerAuth()
@Controller('produtos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProdutosController {
    constructor(private readonly produtoService: ProdutosService){}


@Post()
@ApiOperation({ summary:'Cadastra Produto' })
@Perfis('administrador')
    criar(@Body() dto: CriaProduto){
        return this.produtoService.criar(dto);
    }

@Get()
@ApiOperation({ summary:'Consulta Produto' })
@Perfis('administrador')
    consultaTodos(){
        return this.produtoService.consultaTodos();
    }


@Get(':id')
@ApiOperation({ summary:'Consulta única do produto' })
@Perfis('administrador')
consultaUnica(@Param('id', ParseIntPipe) id: number,){
     
    return this.produtoService.consultaUnica(id)
}

@Put(':id')
@ApiOperation({ summary:'Atualiza os dados do produto' })
@Perfis('administrador')
atualizar(
    @Param('id', ParseIntPipe) id: number, @Body() dto: AtualizaProduto,
) {
    return this.produtoService.atualizar(id, dto);
}


@Delete(':id')
@ApiOperation({ summary:'Apaga o produto' })
@Perfis('administrador')
deleta(@Param('id', ParseIntPipe) id: number){
    return this.produtoService.deleta(id);
}

}