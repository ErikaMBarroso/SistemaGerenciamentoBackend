import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { ProdutosService } from '../produtos/produtos.service';
import { MovimentacaoService } from '../movimentacao/movimentacao.service';
import { CategoriaRepository } from '../categoria/categoria.repository';

describe('DashboardService', () => {
  let service: DashboardService;
  let produtoService: jest.Mocked<ProdutosService>;
  let categoriaRepository: jest.Mocked<CategoriaRepository>;
  let movimentacaoService: jest.Mocked<MovimentacaoService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: ProdutosService,
          useValue: {
            TotalProdutos: jest.fn(),
            estoqueBaixoTotal: jest.fn(),
            estoqueBaixoDash: jest.fn(),
          },
        },
        {
          provide: CategoriaRepository,
          useValue: {
            categoriasCadastradas: jest.fn(),
            graficoBarras: jest.fn(),
          },
        },
        {
          provide: MovimentacaoService,
          useValue: {
            movimentacoesHoje: jest.fn(),
            produtoMaisVendidos: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    produtoService = module.get(ProdutosService);
    categoriaRepository = module.get(CategoriaRepository);
    movimentacaoService = module.get(MovimentacaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('dashboard', () => {
    it('deve montar o payload com os dados', async () => {
      produtoService.TotalProdutos.mockResolvedValue({
        totalProdutos: 150,
        totalEstoque: 2500,
        valorEstoque: 1554.80,
      });
      produtoService.estoqueBaixoTotal.mockResolvedValue(3);
      produtoService.estoqueBaixoDash.mockResolvedValue([
        { nome: 'Ração Premium', quantidade: 0 },
      ]);
      categoriaRepository.categoriasCadastradas.mockResolvedValue(5);
      categoriaRepository.graficoBarras.mockResolvedValue([
        { nome: 'Alimentos', total: 500 },
      ]);
      movimentacaoService.movimentacoesHoje.mockResolvedValue({ entradas: 8, saidas: 8 });
      movimentacaoService.produtoMaisVendidos.mockResolvedValue([
        { nome: 'Ração Premium', quantidadeVendida: 120 },
      ]);

      const result = await service.dashboard();

      expect(result).toEqual({
        produtosCadastrados: 150,
        estoqueTotal: 2500,
        valorEmEstoque: 1554.80,
        baixoEstoque: 3,
        baixoEstoqueResumo: [{ nome: 'Ração Premium', quantidade: 0 }],
        movimentacaoHoje: { entradas: 8, saidas: 8 },
        categoriasCadastradas: 5,
        categoriaGrafico: [{ nome: 'Alimentos', total: 500 }],
        maisVendidos: [{ nome: 'Ração Premium', quantidadeVendida: 120 }],
      });
    });

    it('deve chamar todos os métodos do dashboard uma vez', async () => {
      produtoService.TotalProdutos.mockResolvedValue({ totalProdutos: 0, totalEstoque: 0, valorEstoque: 0 });
      produtoService.estoqueBaixoTotal.mockResolvedValue(0);
      produtoService.estoqueBaixoDash.mockResolvedValue([]);
      categoriaRepository.categoriasCadastradas.mockResolvedValue(0);
      categoriaRepository.graficoBarras.mockResolvedValue([]);
      movimentacaoService.movimentacoesHoje.mockResolvedValue({ entradas: 0, saidas: 0 });
      movimentacaoService.produtoMaisVendidos.mockResolvedValue([]);

      await service.dashboard();

      expect(produtoService.TotalProdutos).toHaveBeenCalledTimes(1);
      expect(produtoService.estoqueBaixoTotal).toHaveBeenCalledTimes(1);
      expect(produtoService.estoqueBaixoDash).toHaveBeenCalledTimes(1);
      expect(categoriaRepository.categoriasCadastradas).toHaveBeenCalledTimes(1);
      expect(categoriaRepository.graficoBarras).toHaveBeenCalledTimes(1);
      expect(movimentacaoService.movimentacoesHoje).toHaveBeenCalledTimes(1);
      expect(movimentacaoService.produtoMaisVendidos).toHaveBeenCalledTimes(1);
    });
  });
});