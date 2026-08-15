import { Test, TestingModule } from '@nestjs/testing';
import { MovimentacaoService } from './movimentacao.service';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { MovimentacaoRepository } from './movimentacao.repository';
import { ProdutoRepository } from '../produtos/produto.repository';
import { Produto } from '../produtos/entities/produto.entity';
import { MovimentacaoEstoque } from './entities/movimentacao.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('MovimentacaoService', () => {
  let service: MovimentacaoService;
  let movimentacaoRepository: jest.Mocked<MovimentacaoRepository>;
  let produtoRepository: jest.Mocked<ProdutoRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovimentacaoService,
        {
          provide: MovimentacaoRepository,
          useValue: {
            salvar: jest.fn(),
            criar: jest.fn(),
            criaMovimentacao: jest.fn(),
            consultaMovimentacao: jest.fn(),
            consultaMovimentacaoIndividual: jest.fn(),
            consultaMovimentacaoTotal: jest.fn(),
            movimentacaoHoje: jest.fn(),
            produtoMaisVendidos: jest.fn(),
            historicoMovimentacao: jest.fn(),
            graficoLinha: jest.fn(),
          },
        },
        {
          provide: ProdutoRepository,
          useValue: {
            achaPorId: jest.fn(),
            estoqueQuantidadeAtual: jest.fn(),
            estoqueBaixo: jest.fn(),
            semMovimentacao: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(MovimentacaoService);
    movimentacaoRepository = module.get(MovimentacaoRepository);
    produtoRepository = module.get(ProdutoRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('criaMovimentacao', () => {
    const dtoEntrada = { produtoId: 1, tipo: 'entrada', quantidade: 5 } as any;
    const dtoSaida = { produtoId: 1, tipo: 'saida', quantidade: 5 } as any;

    it('deve registrar entrada e somar na quantidade do produto', async () => {
      const produto = { produtoId: 1, quantidade: 10, ativo: true } as Produto;
      const movimentacaoResultado = {
        id: 1,
        tipo: 'entrada',
        quantidade: 5,
      } as MovimentacaoEstoque;

      produtoRepository.achaPorId.mockResolvedValue(produto);
      movimentacaoRepository.criaMovimentacao.mockResolvedValue(
        movimentacaoResultado,
      );

      const result = await service.criaMovimentacao(dtoEntrada, 1);

      expect(produtoRepository.achaPorId).toHaveBeenCalledWith(1);
      expect(produto.quantidade).toBe(15);
      expect(movimentacaoRepository.criaMovimentacao).toHaveBeenCalledWith(
        produto,
        dtoEntrada,
        1,
      );
      expect(result).toEqual(movimentacaoResultado);
    });

    it('deve registrar saída e subtrair da quantidade do produto', async () => {
      const produto = { produtoId: 1, quantidade: 10, ativo: true } as Produto;
      const movimentacaoResultado = {
        id: 2,
        tipo: 'saida',
        quantidade: 5,
      } as MovimentacaoEstoque;

      produtoRepository.achaPorId.mockResolvedValue(produto);
      movimentacaoRepository.criaMovimentacao.mockResolvedValue(
        movimentacaoResultado,
      );

      const result = await service.criaMovimentacao(dtoSaida, 1);

      expect(produto.quantidade).toBe(5);
      expect(movimentacaoRepository.criaMovimentacao).toHaveBeenCalledWith(
        produto,
        dtoSaida,
        1,
      );
      expect(result).toEqual(movimentacaoResultado);
    });

    it('deve lançar NotFoundException se produto não existir', async () => {
      produtoRepository.achaPorId.mockResolvedValue(null);

      await expect(service.criaMovimentacao(dtoEntrada, 1)).rejects.toThrow(
        NotFoundException,
      );
      expect(movimentacaoRepository.criaMovimentacao).not.toHaveBeenCalled();
    });

    it('deve lançar BadRequestException se produto estiver desativado', async () => {
      const produto = { produtoId: 1, quantidade: 10, ativo: false } as Produto;
      produtoRepository.achaPorId.mockResolvedValue(produto);

      await expect(service.criaMovimentacao(dtoEntrada, 1)).rejects.toThrow(
        BadRequestException,
      );
      expect(movimentacaoRepository.criaMovimentacao).not.toHaveBeenCalled();
    });

    it('deve lançar BadRequestException se saldo for insuficiente para saída (RN20)', async () => {
      const produto = { produtoId: 1, quantidade: 3, ativo: true } as Produto;
      produtoRepository.achaPorId.mockResolvedValue(produto);

      await expect(service.criaMovimentacao(dtoSaida, 1)).rejects.toThrow(
        BadRequestException,
      );
      expect(produto.quantidade).toBe(3);
      expect(movimentacaoRepository.criaMovimentacao).not.toHaveBeenCalled();
    });
  });

  describe('consultaMovimentacao', () => {
    it('deve retornar o resultado do repository', async () => {
      const dados = [{ nome: 'Ração', tipo: 'saida', total: 5 }];
      movimentacaoRepository.consultaMovimentacao.mockResolvedValue(
        dados as any,
      );

      const result = await service.consultaMovimentacao();

      expect(result).toEqual(dados);
    });
  });

  describe('consultaMovimentacaoIndividual', () => {
    it('deve retornar movimentações de um produto específico', async () => {
      const dados = [{ id: 1, tipo: 'entrada' }] as MovimentacaoEstoque[];
      movimentacaoRepository.consultaMovimentacaoIndividual.mockResolvedValue(
        dados,
      );

      const result = await service.consultaMovimentacaoIndividual(1);

      expect(
        movimentacaoRepository.consultaMovimentacaoIndividual,
      ).toHaveBeenCalledWith(1);
      expect(result).toEqual(dados);
    });
  });

  describe('estoqueQuantidadeAtual', () => {
    it('deve retornar o resultado vindo do ProdutoRepository', async () => {
      const dados = [{ nome: 'Ração', total: 40 }];
      produtoRepository.estoqueQuantidadeAtual.mockResolvedValue(dados as any);

      const result = await service.estoqueQuantidadeAtual();

      expect(produtoRepository.estoqueQuantidadeAtual).toHaveBeenCalled();
      expect(result).toEqual(dados);
    });
  });

  describe('consultaMovimentacaoTotal', () => {
    it('deve retornar o total agrupado por tipo', async () => {
      const dados = [
        { tipo: 'entrada', total: 20 },
        { tipo: 'saida', total: 15 },
      ];
      movimentacaoRepository.consultaMovimentacaoTotal.mockResolvedValue(
        dados as any,
      );

      const result = await service.consultaMovimentacaoTotal();

      expect(result).toEqual(dados);
    });
  });

  describe('historicoMovimentacao', () => {
    it('deve retornar o histórico completo', async () => {
      const dados = [{ id: 1, tipo: 'entrada' }] as MovimentacaoEstoque[];
      movimentacaoRepository.historicoMovimentacao.mockResolvedValue(dados);

      const result = await service.historicoMovimentacao();

      expect(result).toEqual(dados);
    });
  });

  describe('estoqueBaixo', () => {
    it('deve retornar produtos com estoque baixo', async () => {
      const dados = [
        { produtoId: 1, nome: 'Ração', quantidade: 2 },
      ] as Produto[];
      produtoRepository.estoqueBaixo.mockResolvedValue(dados);

      const result = await service.estoqueBaixo();

      expect(result).toEqual(dados);
    });
  });

  describe('movimentacoesHoje', () => {
    it('deve retornar entradas e saídas do dia', async () => {
      const dados = { entradas: 8, saidas: 5 };
      movimentacaoRepository.movimentacaoHoje.mockResolvedValue(dados);

      const result = await service.movimentacoesHoje();

      expect(result).toEqual(dados);
    });
  });

  describe('semMovimentacao', () => {
    it('deve retornar produtos sem movimentação no período', async () => {
      const dados = [{ produtoId: 1, nome: 'Ração' }] as Produto[];
      produtoRepository.semMovimentacao.mockResolvedValue(dados);

      const result = await service.semMovimentacao(30);

      expect(produtoRepository.semMovimentacao).toHaveBeenCalledWith(30);
      expect(result).toEqual(dados);
    });
  });

  describe('produtoMaisVendidos', () => {
    it('deve retornar o ranking de produtos mais vendidos', async () => {
      const dados = [{ nome: 'Ração', quantidadeVendida: 120 }];
      movimentacaoRepository.produtoMaisVendidos.mockResolvedValue(dados);

      const result = await service.produtoMaisVendidos();

      expect(result).toEqual(dados);
    });
  });

  describe('graficoLinha', () => {
    it('deve chamar o repository com os dias corretos para "7dias"', async () => {
      movimentacaoRepository.graficoLinha.mockResolvedValue([]);

      await service.graficoLinha('7dias');

      expect(movimentacaoRepository.graficoLinha).toHaveBeenCalledWith(7);
    });

    it('deve preencher com 0 quando não há movimentações no período', async () => {
      movimentacaoRepository.graficoLinha.mockResolvedValue([]);

      const result = await service.graficoLinha('7dias');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(
        expect.objectContaining({ entrada: 0, saida: 0 }),
      );
    });

    it('deve usar 30 dias como padrão', async () => {
      movimentacaoRepository.graficoLinha.mockResolvedValue([]);

      const result = await service.graficoLinha('periodo-invalido' as any);

      expect(movimentacaoRepository.graficoLinha).toHaveBeenCalledWith(30);
      expect(result).toHaveLength(Math.ceil(30 / 7));
    });
  });
});
