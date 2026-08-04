import { Test, TestingModule } from '@nestjs/testing';
import { ProdutosService } from './produtos.service';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { ProdutoRepository } from './produto.repository';
import { Produto } from './entities/produto.entity';
import { Categoria } from '../categoria/entities/categoria.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ProdutosService', () => {
  let service: ProdutosService;
  let produtoRepository: jest.Mocked<ProdutoRepository>;
  let categoriaRepository: jest.Mocked<Repository<Categoria>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutosService,
        {
          provide: ProdutoRepository,
          useValue: {
            criar: jest.fn(),
            salvar: jest.fn(),
            criarProduto: jest.fn(),
            achaPorId: jest.fn(),
            buscaPorNome: jest.fn(),
            remover: jest.fn(),
            deletarProduto: jest.fn(),
            listaProdutos: jest.fn(),
            estoqueBaixoDash: jest.fn(),
            TotalProdutos: jest.fn(),
            estoqueBaixoTotal: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Categoria), 
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(ProdutosService);
    produtoRepository = module.get(ProdutoRepository);
    categoriaRepository = module.get(getRepositoryToken(Categoria));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('criar', () => {
    const dto = {
      nome: 'Ração',
      descricao: 'comida para cachorro',
      marca: 'petz',
      preco: 19.99,
      quantidade: 20,
      quantidadeMin: 10,
      categoriaId: 1,
    } as any;

    it('deve criar produto com sucesso', async () => {
      const categoria = { categoriaId: 1, nome: 'Comida' } as Categoria;
      const produtoSalvo = { produtoId: 1, ...dto } as Produto;

      produtoRepository.buscaPorNome.mockResolvedValue(null);
      categoriaRepository.findOne.mockResolvedValue(categoria);
      produtoRepository.criarProduto.mockResolvedValue(produtoSalvo);

      const result = await service.criar(dto, 1);

      expect(produtoRepository.buscaPorNome).toHaveBeenCalledWith(dto.nome, dto.marca);
      expect(categoriaRepository.findOne).toHaveBeenCalledWith({ where: { categoriaId: dto.categoriaId } });
      expect(produtoRepository.criarProduto).toHaveBeenCalledWith(dto, 1);
      expect(result).toEqual(produtoSalvo);
    });

    it('deve lançar ConflictException se produto já existe', async () => {
      produtoRepository.buscaPorNome.mockResolvedValue({ nome: 'Ração' } as Produto);

      await expect(service.criar(dto, 1)).rejects.toThrow(ConflictException);
      expect(categoriaRepository.findOne).not.toHaveBeenCalled();
      expect(produtoRepository.criarProduto).not.toHaveBeenCalled();
    });

    it('deve lançar NotFoundException se categoria não existir', async () => {
      produtoRepository.buscaPorNome.mockResolvedValue(null);
      categoriaRepository.findOne.mockResolvedValue(null);

      await expect(service.criar(dto, 1)).rejects.toThrow(NotFoundException);
      expect(produtoRepository.criarProduto).not.toHaveBeenCalled();
    });
  });

  describe('listar', () => {
    it('deve retornar produtos filtrados e paginados', async () => {
      const filtro = { pesquisa: 'ração' } as any;
      const resposta = {
        data: [{ produtoId: 5, nome: 'ração ei' }] as Produto[],
        total: 1,
        paginas: 1,
        totalPages: 1,
      };
      produtoRepository.listaProdutos.mockResolvedValue(resposta);

      const result = await service.listar(filtro);

      expect(produtoRepository.listaProdutos).toHaveBeenCalledWith(filtro);
      expect(result).toEqual(resposta);
    });
  });

  describe('consultaUnica', () => {
    it('deve retornar produto pelo id', async () => {
      const produto = { produtoId: 1, nome: 'comida' } as Produto;
      produtoRepository.achaPorId.mockResolvedValue(produto);

      const result = await service.consultaUnica(1);

      expect(produtoRepository.achaPorId).toHaveBeenCalledWith(1);
      expect(result).toEqual(produto);
    });

    it('deve lançar NotFoundException se produto não existir', async () => {
      produtoRepository.achaPorId.mockResolvedValue(null);

      await expect(service.consultaUnica(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('TotalProdutos', () => {
    it('deve retornar os indicadores gerais', async () => {
      const indicadores = { totalProdutos: 7, totalEstoque: 52, valorEstoque: 700 };
      produtoRepository.TotalProdutos.mockResolvedValue(indicadores);

      const result = await service.TotalProdutos();

      expect(result).toEqual(indicadores);
    });
  });

  describe('estoqueBaixoTotal', () => {
    it('deve retornar a contagem de produtos com estoque baixo', async () => {
      produtoRepository.estoqueBaixoTotal.mockResolvedValue(3);

      const result = await service.estoqueBaixoTotal();

      expect(result).toBe(3);
    });
  });

  describe('estoqueBaixoDash', () => {
    it('deve retornar o resumo de produtos com estoque baixo', async () => {
      const resumo = [{ nome: 'Ração', quantidade: 0 }];
      produtoRepository.estoqueBaixoDash.mockResolvedValue(resumo);

      const result = await service.estoqueBaixoDash();

      expect(result).toEqual(resumo);
    });
  });

  describe('atualizar', () => {
    it('deve atualizar produto com sucesso', async () => {
      const produtoExistente = { produtoId: 1, nome: 'Ração', categoriaId: 1 } as Produto;
      const dto = { nome: 'Ração Premium' } as any;
      const produtoAtualizado = { produtoId: 1, nome: 'Ração Premium' } as Produto;

      produtoRepository.achaPorId.mockResolvedValue(produtoExistente); // usado dentro de consultaUnica
      produtoRepository.buscaPorNome.mockResolvedValue(null);
      produtoRepository.salvar.mockResolvedValue(produtoAtualizado);

      const result = await service.atualizar(1, dto);

      expect(produtoRepository.buscaPorNome).toHaveBeenCalledWith('Ração Premium');
      expect(result).toEqual(produtoAtualizado);
    });

    it('deve lançar ConflictException se o novo nome já existir', async () => {
      const produtoExistente = { produtoId: 1, nome: 'Ração' } as Produto;
      const dto = { nome: 'Areia' } as any;

      produtoRepository.achaPorId.mockResolvedValue(produtoExistente);
      produtoRepository.buscaPorNome.mockResolvedValue({ produtoId: 2, nome: 'Areia' } as Produto);

      await expect(service.atualizar(1, dto)).rejects.toThrow(ConflictException);
      expect(produtoRepository.salvar).not.toHaveBeenCalled();
    });

    it('deve lançar NotFoundException se a nova categoria não existir', async () => {
      const produtoExistente = { produtoId: 1, nome: 'Ração', categoriaId: 1 } as Produto;
      const dto = { categoriaId: 99 } as any;

      produtoRepository.achaPorId.mockResolvedValue(produtoExistente);
      categoriaRepository.findOne.mockResolvedValue(null);

      await expect(service.atualizar(1, dto)).rejects.toThrow(NotFoundException);
      expect(produtoRepository.salvar).not.toHaveBeenCalled();
    });
  });

  describe('deleta', () => {
    it('deve chamar deletarProduto e retornar a mensagem do repository', async () => {
      const produto = { produtoId: 1, nome: 'comida', quantidade: 10 } as Produto;
      const resposta = { mensagem: 'O estoque foi zerado' };

      produtoRepository.achaPorId.mockResolvedValue(produto);
      produtoRepository.deletarProduto.mockResolvedValue(resposta);

      const result = await service.deleta(1);

      expect(produtoRepository.deletarProduto).toHaveBeenCalledWith(produto);
      expect(result).toEqual(resposta);
    });

    it('deve lançar NotFoundException se produto não existir', async () => {
      produtoRepository.achaPorId.mockResolvedValue(null);

      await expect(service.deleta(999)).rejects.toThrow(NotFoundException);
      expect(produtoRepository.deletarProduto).not.toHaveBeenCalled();
    });
  });
});