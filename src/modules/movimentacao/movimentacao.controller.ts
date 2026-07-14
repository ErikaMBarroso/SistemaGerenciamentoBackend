import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Request, UseGuards } from '@nestjs/common';
import { MovimentacaoService } from './movimentacao.service';
import { MovimentacaoDto } from './dto/movimentacao.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { ApiOperation } from '@nestjs/swagger';

@Controller('movimentacao')
export class MovimentacaoController {
    constructor(private readonly movimentacaoService: MovimentacaoService){}

    @Post()
    @ApiOperation({ summary:'Cria Movimentação de Entrada ou Saída' })
    @UseGuards(JwtAuthGuard)
    criar(@Body() dto: MovimentacaoDto, @Request() req: any){
        console.log(req.user);
        return this.movimentacaoService.criaMovimentacao(dto, req.user.usuarioId);
        
    }

    @Get()
    @ApiOperation({ summary:'Apresenta Histórico de Entrada e Saída' })
    @UseGuards(JwtAuthGuard)
    consultaMovimentacao(){
        return this.movimentacaoService.consultaMovimentacao()
    }

    @Get('historico')
    @ApiOperation({ summary:'Apresenta Histórico da Movimentação' })
    @UseGuards(JwtAuthGuard)
    historicoMovimentacao(){
        return this.movimentacaoService.historicoMovimentacao();
    }

    @Get('produtoTotal')
    @ApiOperation({ summary:'Apresenta a Quantidade Total de cada Produto' })
    @UseGuards(JwtAuthGuard)
    estoqueQuantidadeAtual(){
        return this.movimentacaoService.estoqueQuantidadeAtual()
    }

    @Get('total')
    @ApiOperation({ summary:'Apresenta a Quantidade Total de Entarda e Saída' })
    @UseGuards(JwtAuthGuard)
    consultaMovimentacaoTotal(){
        return this.movimentacaoService.consultaMovimentacaoTotal()
    }

    
    @Get('estoqueBaixo')
    @ApiOperation({ summary:'Apresenta Produtos com Estoque Baixo' })
    @UseGuards(JwtAuthGuard)
    estoqueBaixo(){
        return this.movimentacaoService.estoqueBaixo();
    }

    @Get('semMovimentacao')
    @ApiOperation({ summary:'Cadastra Produto' })
    @UseGuards(JwtAuthGuard)
    semMovimentacao(@Query('dias') dias?: string){
        return this.movimentacaoService.semMovimentacao(dias ? Number(dias): 30)
    }

    @Get(':produtoId')
    @ApiOperation({ summary:'Cadastra Produto' })
    @UseGuards(JwtAuthGuard)
    consultaMovimentacaoIndividual(@Param('produtoId', ParseIntPipe) produtoId: number){
        return this.movimentacaoService.consultaMovimentacaoIndividual(produtoId);
    }


}
