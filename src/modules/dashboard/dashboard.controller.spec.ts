import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/role.guard';

describe('DashboardController', () => {
  let controller: DashboardController;
  let dashboardService: jest.Mocked<DashboardService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        {
          provide: DashboardService,
          useValue: {
            dashboard: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<DashboardController>(DashboardController);
    dashboardService = module.get(DashboardService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('resumo', () => {
    it('deve retornar os dados do dashboard', async () => {
      const dadosDashboard = {
        produtosCadastrados: 100,
        estoqueTotal: 1500,
        valorEmEstoque: 1240.35,
        baixoEstoque: 3,
        baixoEstoqueResumo: [{ nome: 'Ração', quantidade: 0 }],
        movimentacaoHoje: { entradas: 8, saidas: 8 },
        categoriasCadastradas: 5,
        categoriaGrafico: [{ nome: 'Alimentos', total: 500 }],
        maisVendidos: [{ nome: 'Ração', quantidadeVendida: 120 }],
      };

      dashboardService.dashboard.mockResolvedValue(dadosDashboard as any);

      const result = await controller.resumo();

      expect(dashboardService.dashboard).toHaveBeenCalled();
      expect(result).toEqual(dadosDashboard);
    });
  });
});
