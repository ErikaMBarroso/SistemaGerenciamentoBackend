import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { request } from 'http';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/role.guard';
import { ProdutosService } from './produtos.service';
import { Perfis } from '../auth/auth.decorator';
import { CriaProduto } from './dto/criaProduto.dto';
import { AtualizaProduto } from './dto/atualizaProduto.dto';

@Controller('produtos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProdutosController {
    constructor(private readonly produtoService: ProdutosService){}


@Post()
@Perfis('administrador')
    criar(@Body() dto: CriaProduto){
        return this.produtoService.criar(dto);
    }

@Get()
@Perfis('administrador')
    consultaTodos(){
        return this.produtoService.consultaTodos();
    }

@Put(':id')
@Perfis('administrador')
atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizaProduto,
) {
    return this.produtoService.atualizar(id, dto);
}


@Delete(':id')
@Perfis('administrador')
deleta(@Param('id', ParseIntPipe) id: number){
    return this.produtoService.deleta(id);
}


}