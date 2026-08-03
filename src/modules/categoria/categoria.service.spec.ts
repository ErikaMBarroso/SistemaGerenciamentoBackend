import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaService } from './categoria.service';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { CategoriaRepository } from './categoria.repository';
import { Categoria } from './entities/categoria.entity';

describe('CategoriaService', () => {
  let service: CategoriaService;
  let repository: jest.Mocked<CategoriaRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriaService,
        {
          provide: CategoriaRepository,
          useValue: {
            buscaNome: jest.fn(),
            buscaPorId: jest.fn(),
            todos: jest.fn(),
            categoriasCadastradas: jest.fn(),
            criar: jest.fn(),
            salvar: jest.fn(),
            deletaCategoria: jest.fn(),
            graficoBarras: jest.fn(),

          },
        },
      ],
    }).compile();

    service = module.get(CategoriaService);
    repository = module.get(CategoriaRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
});
