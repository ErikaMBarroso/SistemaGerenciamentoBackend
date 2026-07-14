import { Body, Controller, Get, Param, ParseIntPipe, Post, Request, UseGuards } from '@nestjs/common';
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
    historicoMovimentacao(){
        return this.movimentacaoService.historicoMovimentacao();
    }

    @Get('total')
    @UseGuards(JwtAuthGuard)
    consultaMovimentacaoTotal(){
        return this.movimentacaoService.consultaMovimentacaoTotal()
    }

    @Get('produtoTotal')
    @UseGuards(JwtAuthGuard)
    estoqueQuantidadeAtual(){
        return this.movimentacaoService.estoqueQuantidadeAtual()
    }

    @Get(':produtoId')
    @UseGuards(JwtAuthGuard)
    consultaMovimentacaoIndividual(@Param('produtoId', ParseIntPipe) produtoId: number){
        return this.movimentacaoService.consultaMovimentacaoIndividual(produtoId);
    }
}
