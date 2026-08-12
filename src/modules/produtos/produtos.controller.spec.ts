import { Test, TestingModule } from '@nestjs/testing';
import { ProdutosController } from './produtos.controller';
import { describe, beforeEach, expect, it, jest } from '@jest/globals';
import { ProdutosService } from './produtos.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/role.guard';
import { Produto } from './entities/produto.entity';

describe('ProdutosController', () => {
  let controller: ProdutosController;
  let produtosService: jest.Mocked<ProdutosService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutosController],
      providers: [
        {
          provide: ProdutosService,
          useValue: {
            criar: jest.fn(),
            listar: jest.fn(),
            consultaUnica: jest.fn(),
            atualizar: jest.fn(),
            deleta: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ProdutosController>(ProdutosController);
    produtosService = module.get(ProdutosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('criar', () => {
    it('deve chamar produtoService.criar com o dto e o id do usuário logado (sub)', async () => {
      const dto = {
        nome: 'Ração',
        descricao: 'comida',
        marca: 'petz',
        preco: 19.99,
        quantidade: 20,
        quantidadeMin: 10,
        categoriaId: 1,
      } as any;
      const usuarioLogado = { sub: 3, nome: 'Admin', perfil: 'administrador' };
      const produtoCriado = { produtoId: 1, ...dto } as Produto;

      produtosService.criar.mockResolvedValue(produtoCriado);

      const result = await controller.criar(dto, usuarioLogado);

      expect(produtosService.criar).toHaveBeenCalledWith(dto, 3);
      expect(result).toEqual(produtoCriado);
    });
  });

  describe('listar', () => {
    it('deve chamar produtoService.listar com o filtro', async () => {
      const filtro = { pesquisa: 'ração' } as any;
      const resposta = {
        data: [{ produtoId: 5, nome: 'ração ei' }] as Produto[],
        total: 1,
        paginas: 1,
        totalPages: 1,
      };

      produtosService.listar.mockResolvedValue(resposta);

      const result = await controller.listar(filtro);

      expect(produtosService.listar).toHaveBeenCalledWith(filtro);
      expect(result).toEqual(resposta);
    });
  });

  describe('consultaUnica', () => {
    it('deve chamar produtoService.consultaUnica com o id', async () => {
      const produto = { produtoId: 1, nome: 'Ração' } as Produto;
      produtosService.consultaUnica.mockResolvedValue(produto);

      const result = await controller.consultaUnica(1);

      expect(produtosService.consultaUnica).toHaveBeenCalledWith(1);
      expect(result).toEqual(produto);
    });
  });

  describe('atualizar', () => {
    it('deve chamar produtoService.atualizar com id e dto', async () => {
      const dto = { nome: 'Ração Premium' } as any;
      const produtoAtualizado = {
        produtoId: 1,
        nome: 'Ração Premium',
      } as Produto;

      produtosService.atualizar.mockResolvedValue(produtoAtualizado);

      const result = await controller.atualizar(1, dto);

      expect(produtosService.atualizar).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(produtoAtualizado);
    });
  });

  describe('deleta', () => {
    it('deve chamar produtoService.deleta com o id', async () => {
      const resposta = { mensagem: 'O estoque foi zerado' };
      produtosService.deleta.mockResolvedValue(resposta);

      const result = await controller.deleta(1);

      expect(produtosService.deleta).toHaveBeenCalledWith(1);
      expect(result).toEqual(resposta);
    });
  });
});
