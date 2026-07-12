import { Body, Controller, Get, Param, ParseIntPipe, Post, Request } from '@nestjs/common';
import { MovimentacaoService } from './movimentacao.service';
import { MovimentacaoDto } from './dto/movimentacao.dto';

@Controller('movimentacao')
export class MovimentacaoController {
    constructor(private readonly movimentacaoService: MovimentacaoService){}

    @Post()
    criar(@Body() dto: MovimentacaoDto, @Request() req: any){
        return this.movimentacaoService.criaMovimentacao(dto, req.user.usuarioId);
        
    }

    @Get()
    historicoMovimentacao(){
        return this.movimentacaoService.historicoMovimentacao();
    }

    @Get('total')
    consultaMovimentacaoTotal(){
        return this.movimentacaoService.consultaMovimentacaoTotal()
    }

    @Get(':produtoId')
    consultaMovimentacaoIndividual(@Param('produtoId', ParseIntPipe) produtoId: number){
        return this.movimentacaoService.consultaMovimentacaoIndividual(produtoId);
    }
}
