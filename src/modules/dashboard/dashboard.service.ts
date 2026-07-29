import { Injectable } from '@nestjs/common';
import { ProdutosService } from '../produtos/produtos.service';
import { MovimentacaoService } from '../movimentacao/movimentacao.service';
import { CategoriaRepository } from '../categoria/categoria.repository';

@Injectable()
export class DashboardService {
    constructor( 
        private readonly produtoService: ProdutosService,

        private readonly categoriaService: CategoriaRepository,

        private readonly movimentacaoService: MovimentacaoService,
    ){}

    async dashboard(){
        const [ somaGeral, estoqueBaixo,estoqueBaixoResumo, categorias, categoriaGrafico, movimentacaoHoje, maisVendidos] = await Promise.all([
            this.produtoService.TotalProdutos(),
            this.produtoService.estoqueBaixoTotal(),
            this.produtoService.estoqueBaixoDash(),
            this.categoriaService.categoriasCadastradas(),
            this.categoriaService.graficoBarras(),
            this.movimentacaoService.movimentacoesHoje(),
            this.movimentacaoService.produtoMaisVendidos(),
        ]);

        return {
            produtosCadastrados: somaGeral.totalProdutos,
            estoqueTotal: somaGeral.totalEstoque,
            valorEmEstoque: somaGeral.valorEstoque,
            baixoEstoque: estoqueBaixo,
            baixoEstoqueResumo: estoqueBaixoResumo, movimentacaoHoje,
            categoriasCadastradas:categorias, categoriaGrafico, maisVendidos
        }
    }

   
}
