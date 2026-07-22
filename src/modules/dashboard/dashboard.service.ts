import { Injectable } from '@nestjs/common';
import { ProdutosService } from '../produtos/produtos.service';
import { MovimentacaoService } from '../movimentacao/movimentacao.service';

@Injectable()
export class DashboardService {
    constructor( 
        private readonly produtoService: ProdutosService,

        private readonly movimentacaoService: MovimentacaoService,
    ){}

    async dashboard(){
        const [ estoqueQuantidadeAtual, estoqueBaixo , consultaMovimentacaoTotal] = await Promise.all([
            this.movimentacaoService.estoqueBaixo(),
            this.movimentacaoService.estoqueQuantidadeAtual(),
            this.movimentacaoService.consultaMovimentacaoTotal(),
        ]);

        return {
            estoqueQuantidadeAtual: estoqueQuantidadeAtual.estoqueQuantidadeAtual,
            estoqueBaixo: estoqueBaixo.estoqueBaixo,
             consultaMovimentacaoTotal:  consultaMovimentacaoTotal.consultaMovimentacaoTotal,
        }
    }

   
}
