import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaService } from './categoria.service';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { CategoriaRepository } from './categoria.repository';
import { Categoria } from './entities/categoria.entity';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

describe('CategoriaService', () => {
  let service: CategoriaService;
  let repository: jest.Mocked<CategoriaRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriaService,
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

  describe('criaCategoria', () => {
    it('deve criar categoria com sucesso', async () => {
      const dto = { nome: 'Ração' };
      const categoriaCriada = { nome: 'ração' } as Categoria;
      const categoriaSalva = { categoriaId: 1, nome: 'Ração' } as Categoria;

      repository.buscaNome.mockResolvedValue(null);
      repository.criar.mockReturnValue(categoriaCriada);
      repository.salvar.mockResolvedValue(categoriaSalva);

      const result = await service.criaCategoria(dto);

      expect(repository.buscaNome).toHaveBeenCalledWith('Ração');
      expect(repository.criar).toHaveBeenCalledWith(dto);
      expect(repository.salvar).toHaveBeenCalledWith(categoriaCriada);
      expect(result).toEqual(categoriaSalva);
    });

    it('deve lançar ConflictException se categoria já existe', async () => {
      const dto = { nome: 'Ração' };
      repository.buscaNome.mockResolvedValue({ nome: 'ração' } as Categoria);

      await expect(service.criaCategoria(dto)).rejects.toThrow(
        ConflictException,
      );
      expect(repository.criar).not.toHaveBeenCalled();
      expect(repository.salvar).not.toHaveBeenCalled();
    });
  });

  describe('consultaCategoria', () => {
    it('deve retornar lista de categorias', async () => {
      const categorias = [{ categoriaId: 1, nome: 'Ração' }] as Categoria[];
      repository.todos.mockResolvedValue(categorias);

      const result = await service.consultaCategoria();

      expect(repository.todos).toHaveBeenCalled();
      expect(result).toEqual(categorias);
    });
  });

  describe('consultaUnicaCategoria', () => {
    it('deve retornar categoria pelo id', async () => {
      const categoria = { categoriaId: 1, nome: 'Ração' } as Categoria;
      repository.buscaPorId.mockResolvedValue(categoria);

      const result = await service.consultaUnicaCategoria(1);

      expect(repository.buscaPorId).toHaveBeenCalledWith(1);
      expect(result).toEqual(categoria);
    });

    it('deve lançar NotFoundException se categoria não existir', async () => {
      repository.buscaPorId.mockResolvedValue(null);

      await expect(service.consultaUnicaCategoria(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('categoriasCadastrada', () => {
    it('deve retornar o total de categorias', async () => {
      repository.categoriasCadastradas.mockResolvedValue(5);

      const result = await service.categoriasCadastrada();

      expect(result).toBe(5);
    });
  });

  describe('graficoBarras', () => {
    it('deve retornar os dados agregados por categoria', async () => {
      const dados = [
        { nome: 'Alimentos', total: 100 },
        { nome: 'Higiene', total: 50 },
      ];

      repository.graficoBarras.mockResolvedValue(dados);

      const result = await service.graficoBarras();

      expect(repository.graficoBarras).toHaveBeenCalled();
      expect(result).toEqual(dados);
    });
  });

  describe('atualizaCategoria', () => {
    it('deve atualizar categoria com sucesso', async () => {
      const categoriaExistente = { categoriaId: 1, nome: 'Ração' } as Categoria;
      const dto = { nome: 'Ração Premium' };
      const categoriaAtualizada = {
        categoriaId: 1,
        nome: 'Ração Premium',
      } as Categoria;

      repository.buscaPorId.mockResolvedValue(categoriaExistente);
      repository.buscaNome.mockResolvedValue(null);
      repository.salvar.mockResolvedValue(categoriaAtualizada);

      const result = await service.atualizaCategoria(1, dto);

      expect(repository.buscaNome).toHaveBeenCalledWith('Ração Premium');
      expect(result).toEqual(categoriaAtualizada);
    });

    it('deve lançar ConflictException se o novo nome já existir em outra categoria', async () => {
      const categoriaExistente = { categoriaId: 1, nome: 'Ração' } as Categoria;
      const dto = { nome: 'Areia' };

      repository.buscaPorId.mockResolvedValue(categoriaExistente);
      repository.buscaNome.mockResolvedValue({
        categoriaId: 2,
        nome: 'Areia',
      } as Categoria);

      await expect(service.atualizaCategoria(1, dto)).rejects.toThrow(
        ConflictException,
      );
      expect(repository.salvar).not.toHaveBeenCalled();
    });
    it('não deve checar duplicidade se o nome não mudou', async () => {
      const categoriaExistente = { categoriaId: 1, nome: 'Ração' } as Categoria;
      const dto = { nome: 'Ração' }; // mesmo nome

      repository.buscaPorId.mockResolvedValue(categoriaExistente);
      repository.salvar.mockResolvedValue(categoriaExistente);

      await service.atualizaCategoria(1, dto);

      expect(repository.buscaNome).not.toHaveBeenCalled();
    });
  });
  describe('deletaCategoria', () => {
    it('deve remover categoria sem produtos vinculados', async () => {
      const categoria = {
        categoriaId: 1,
        nome: 'Ração',
        produtos: [],
      } as Categoria;
      repository.buscaPorId.mockResolvedValue(categoria);

      const result = await service.deletaCategoria(1);

      expect(repository.deletaCategoria).toHaveBeenCalledWith(categoria);
      expect(result).toEqual({ mensagem: 'categoria removida' });
    });

    it('deve lançar BadRequestException se categoria tiver produtos vinculados', async () => {
      const categoria = {
        categoriaId: 1,
        nome: 'Ração',
        produtos: [{ produtoId: 1 }],
      } as Categoria;
      repository.buscaPorId.mockResolvedValue(categoria);

      await expect(service.deletaCategoria(1)).rejects.toThrow(
        BadRequestException,
      );
      expect(repository.deletaCategoria).not.toHaveBeenCalled();
    });
  });
});
