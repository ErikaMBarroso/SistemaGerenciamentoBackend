import { Test, TestingModule } from '@nestjs/testing';
import { ProdutosService } from './produtos.service';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { ProdutoRepository } from './produto.repository';

describe('ProdutosService', () => {
  let service: ProdutosService;
  let repository: jest.Mocked<ProdutoRepository>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProdutosService,
        {
          provide: ProdutoRepository,
          useValue:{
            criar: jest.fn(),
            salvar: jest.fn(),
            achaPorId: jest.fn(),
            buscaPorNome: jest.fn(),
            remover: jest.fn(),
            deletarProduto: jest.fn(),
            estoqueQuantidadeAtual: jest.fn(),
            estoqueBaixo: jest.fn(),
            estoqueBaixoDash: jest.fn(),
            semMovimentacao: jest.fn(),
            TotalProdutos: jest.fn(),
            estoqueBaixoTotal: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(ProdutosService);
    repository = module.get(ProdutoRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
