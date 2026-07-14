import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Request, UseGuards } from '@nestjs/common';
import { MovimentacaoService } from './movimentacao.service';
import { MovimentacaoDto } from './dto/movimentacao.dto';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('movimentacao')
export class MovimentacaoController {
    constructor(private readonly movimentacaoService: MovimentacaoService){}

    @Post()
    @UseGuards(JwtAuthGuard)
    criar(@Body() dto: MovimentacaoDto, @Request() req: any){
        console.log(req.user);
        return this.movimentacaoService.criaMovimentacao(dto, req.user.usuarioId);
        
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    consultaMovimentacao(){
        return this.movimentacaoService.consultaMovimentacao()
    }

    @Get('historico')
    @UseGuards(JwtAuthGuard)
    historicoMovimentacao(){
        return this.movimentacaoService.historicoMovimentacao();
    }

    @Get('produtoTotal')
    @UseGuards(JwtAuthGuard)
    estoqueQuantidadeAtual(){
        return this.movimentacaoService.estoqueQuantidadeAtual()
    }

    @Get('total')
    @UseGuards(JwtAuthGuard)
    consultaMovimentacaoTotal(){
        return this.movimentacaoService.consultaMovimentacaoTotal()
    }

    
    @Get('estoqueBaixo')
    @UseGuards(JwtAuthGuard)
    estoqueBaixo(){
        return this.movimentacaoService.estoqueBaixo();
    }

    @Get('semMovimentacao')
    @UseGuards(JwtAuthGuard)
    semMovimentacao(@Query('dias') dias?: string){
        return this.movimentacaoService.semMovimentacao(dias ? Number(dias): 30)
    }

    @Get(':produtoId')
    @UseGuards(JwtAuthGuard)
    consultaMovimentacaoIndividual(@Param('produtoId', ParseIntPipe) produtoId: number){
        return this.movimentacaoService.consultaMovimentacaoIndividual(produtoId);
    }


}
