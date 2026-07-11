import { Body, Controller, Post, Request } from '@nestjs/common';
import { MovimentacaoService } from './movimentacao.service';
import { MovimentacaoDto } from './dto/movimentacao.dto';

@Controller('movimentacao')
export class MovimentacaoController {
    constructor(private readonly movimentacaoService: MovimentacaoService){}

    @Post()
    criar(@Body() dto: MovimentacaoDto, @Request() req: any){
        return this.movimentacaoService.criaMovimentacao(dto, req.user.usuarioId);
        
    }
}
