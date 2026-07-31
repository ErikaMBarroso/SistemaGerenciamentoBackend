import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaService } from './categoria.service';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { CategoriaRepository } from './categoria.repository';

describe('CategoriaService', () => {
  let service: CategoriaService;
  let repository: jest.Mocked<CategoriaRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriaService,
        {
          provide: CategoriaRepository,
          useValue: {

          }
        }
      ],
    }).compile();

    service = module.get(CategoriaService);
    repository = module.get(CategoriaRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
