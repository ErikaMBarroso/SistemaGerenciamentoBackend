import { Test, TestingModule } from '@nestjs/testing';
import { MovimentacaoService } from './movimentacao.service';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { MovimentacaoRepository } from './movimentacao.repository';

describe('MovimentacaoService', () => {
  let service: MovimentacaoService;
  let repository: jest.Mocked<MovimentacaoRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MovimentacaoService,
        {
        provide: MovimentacaoRepository,
        useValue:{
          salvar: jest.fn(),
           criar : jest.fn(),
           criaMovimentacao: jest.fn(),
           consultaMovimentacao: jest.fn(),
           consultaMovimentacaoIndividual: jest.fn(),
           consultaMovimentacaoTotal: jest.fn(),
           movimentacaoHoje: jest.fn(),
           produtoMaisVendidos: jest.fn(),
           historicoMovimentacao: jest.fn(),
           graficoLinha: jest.fn(),
        }

        },

      ],
    }).compile();

    service = module.get(MovimentacaoService);
    repository = module.get(MovimentacaoRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
