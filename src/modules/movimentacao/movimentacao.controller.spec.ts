import { Test, TestingModule } from '@nestjs/testing';
import { MovimentacaoController } from './movimentacao.controller';
import { describe, beforeEach, expect, it, jest } from '@jest/globals';
import { MovimentacaoService } from './movimentacao.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/role.guard';
import { MovimentacaoEstoque } from './entities/movimentacao.entity';

describe('MovimentacaoController', () => {
  let controller: MovimentacaoController;
  let movimentacaoService: jest.Mocked<MovimentacaoService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovimentacaoController],
      providers: [
        {
          provide: MovimentacaoService,
          useValue: {
            criaMovimentacao: jest.fn(),
            consultaMovimentacao: jest.fn(),
            historicoMovimentacao: jest.fn(),
            estoqueQuantidadeAtual: jest.fn(),
            consultaMovimentacaoTotal: jest.fn(),
            estoqueBaixo: jest.fn(),
            semMovimentacao: jest.fn(),
            graficoLinha: jest.fn(),
            consultaMovimentacaoIndividual: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<MovimentacaoController>(MovimentacaoController);
    movimentacaoService = module.get(MovimentacaoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('criar', () => {
    it('deve chamar movimentacaoService.criaMovimentacao com dto e o id do usuário logado', async () => {
      const dto = { tipo: 'entrada', quantidade: 10, produtoId: 1 } as any;
      const usuarioLogado = {
        usuarioId: 3,
        nome: 'Admin',
        perfil: 'administrador',
      };
      const movimentacaoCriada = {
        id: 1,
        tipo: 'entrada',
        quantidade: 10,
      } as MovimentacaoEstoque;

      movimentacaoService.criaMovimentacao.mockResolvedValue(
        movimentacaoCriada,
      );

      const result = await controller.criar(dto, usuarioLogado);

      expect(movimentacaoService.criaMovimentacao).toHaveBeenCalledWith(dto, 3);
      expect(result).toEqual(movimentacaoCriada);
    });
  });

  describe('consultaMovimentacao', () => {
    it('deve retornar o resultado de consultaMovimentacao', async () => {
      const dados = [{ nome: 'Ração', tipo: 'saida', total: 5 }];
      movimentacaoService.consultaMovimentacao.mockResolvedValue(dados as any);

      const result = await controller.consultaMovimentacao();

      expect(movimentacaoService.consultaMovimentacao).toHaveBeenCalled();
      expect(result).toEqual(dados);
    });
  });

  describe('historicoMovimentacao', () => {
    it('deve retornar o histórico completo', async () => {
      const dados = [{ id: 1, tipo: 'entrada' }] as MovimentacaoEstoque[];
      movimentacaoService.historicoMovimentacao.mockResolvedValue(dados);

      const result = await controller.historicoMovimentacao();

      expect(movimentacaoService.historicoMovimentacao).toHaveBeenCalled();
      expect(result).toEqual(dados);
    });
  });

  describe('estoqueQuantidadeAtual', () => {
    it('deve retornar a quantidade atual por produto', async () => {
      const dados = [{ nome: 'Ração', total: 40 }];
      movimentacaoService.estoqueQuantidadeAtual.mockResolvedValue(
        dados as any,
      );

      const result = await controller.estoqueQuantidadeAtual();

      expect(movimentacaoService.estoqueQuantidadeAtual).toHaveBeenCalled();
      expect(result).toEqual(dados);
    });
  });

  describe('consultaMovimentacaoTotal', () => {
    it('deve retornar o total agrupado por tipo', async () => {
      const dados = [
        { tipo: 'entrada', total: 20 },
        { tipo: 'saida', total: 15 },
      ];
      movimentacaoService.consultaMovimentacaoTotal.mockResolvedValue(
        dados as any,
      );

      const result = await controller.consultaMovimentacaoTotal();

      expect(movimentacaoService.consultaMovimentacaoTotal).toHaveBeenCalled();
      expect(result).toEqual(dados);
    });
  });

  describe('estoqueBaixo', () => {
    it('deve retornar produtos com estoque baixo', async () => {
      const dados = [{ produtoId: 1, nome: 'Ração', quantidade: 2 }] as any[];
      movimentacaoService.estoqueBaixo.mockResolvedValue(dados);

      const result = await controller.estoqueBaixo();

      expect(movimentacaoService.estoqueBaixo).toHaveBeenCalled();
      expect(result).toEqual(dados);
    });
  });

  describe('semMovimentacao', () => {
    it('deve chamar semMovimentacao com o número de dias', async () => {
      const dados = [{ produtoId: 1, nome: 'Ração' }] as any[];
      movimentacaoService.semMovimentacao.mockResolvedValue(dados);

      const result = await controller.semMovimentacao('15');

      expect(movimentacaoService.semMovimentacao).toHaveBeenCalledWith(15);
      expect(result).toEqual(dados);
    });

    it('deve usar 30 dias como padrão quando "dias" não é informado', async () => {
      movimentacaoService.semMovimentacao.mockResolvedValue([]);

      await controller.semMovimentacao(undefined);

      expect(movimentacaoService.semMovimentacao).toHaveBeenCalledWith(30);
    });
  });

  describe('graficoLinha', () => {
    it('deve chamar graficoLinha com o período do filtro', async () => {
      const filtro = { periodo: '7dias' } as any;
      const dados = [{ data: '13/08', entrada: 5, saida: 2 }];
      movimentacaoService.graficoLinha.mockResolvedValue(dados as any);

      const result = await controller.graficoLinha(filtro);

      expect(movimentacaoService.graficoLinha).toHaveBeenCalledWith('7dias');
      expect(result).toEqual(dados);
    });
  });

  describe('consultaMovimentacaoIndividual', () => {
    it('deve chamar consultaMovimentacaoIndividual com o produtoId', async () => {
      const dados = [{ id: 1, tipo: 'entrada' }] as MovimentacaoEstoque[];
      movimentacaoService.consultaMovimentacaoIndividual.mockResolvedValue(
        dados,
      );

      const result = await controller.consultaMovimentacaoIndividual(1);

      expect(
        movimentacaoService.consultaMovimentacaoIndividual,
      ).toHaveBeenCalledWith(1);
      expect(result).toEqual(dados);
    });
  });
});
