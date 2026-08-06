import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaController } from './categoria.controller';
import { CategoriaService } from './categoria.service';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/role.guard';
import { Categoria } from './entities/categoria.entity';

describe('CategoriaController', () => {
  let controller: CategoriaController;
  let categoriaService: jest.Mocked<CategoriaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriaController],
      providers: [
        {
          provide: CategoriaService,
          useValue: {
            criaCategoria: jest.fn(),
            consultaCategoria: jest.fn(),
            consultaUnicaCategoria: jest.fn(),
            atualizaCategoria: jest.fn(),
            deletaCategoria: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CategoriaController>(CategoriaController);
    categoriaService = module.get(CategoriaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('criaCategoria', () => {
    it('deve chamar categoriaService.criaCategoria com o dto', async () => {
      const dto = { nome: 'Alimentos' };
      const categoriaCriada = {
        categoriaId: 1,
        nome: 'Alimentos',
      } as Categoria;
      categoriaService.criaCategoria.mockResolvedValue(categoriaCriada);

      const result = await controller.criaCategoria(dto);

      expect(categoriaService.criaCategoria).toHaveBeenCalledWith(dto);
      expect(result).toEqual(categoriaCriada);
    });
  });

  describe('consultaCategoria', () => {
    it('deve retornar a lista de categorias', async () => {
      const categorias = [{ categoriaId: 1, nome: 'Alimentos' }] as Categoria[];
      categoriaService.consultaCategoria.mockResolvedValue(categorias);

      const result = await controller.consultaCategoria();

      expect(categoriaService.consultaCategoria).toHaveBeenCalled();
      expect(result).toEqual(categorias);
    });
  });

  describe('consultaCategoriaUnica', () => {
    it('deve retornar a categoria pelo id', async () => {
      const categoria = { categoriaId: 1, nome: 'Alimentos' } as Categoria;
      categoriaService.consultaUnicaCategoria.mockResolvedValue(categoria);

      const result = await controller.consultaCategoriaUnica(1);

      expect(categoriaService.consultaUnicaCategoria).toHaveBeenCalledWith(1);
      expect(result).toEqual(categoria);
    });
  });

  describe('atualizaCategoria', () => {
    it('deve chamar categoriaService.atualizaCategoria com id e dto', async () => {
      const dto = { nome: 'Alimentos Premium' };
      const categoriaAtualizada = {
        categoriaId: 1,
        nome: 'Alimentos Premium',
      } as Categoria;
      categoriaService.atualizaCategoria.mockResolvedValue(categoriaAtualizada);

      const result = await controller.atualizaCategoria(1, dto);

      expect(categoriaService.atualizaCategoria).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(categoriaAtualizada);
    });
  });

  describe('deletaCategoria', () => {
    it('deve chamar categoriaService.deletaCategoria com o id', async () => {
      const resposta = { mensagem: 'categoria removida' };
      categoriaService.deletaCategoria.mockResolvedValue(resposta);

      const result = await controller.deletaCategoria(1);

      expect(categoriaService.deletaCategoria).toHaveBeenCalledWith(1);
      expect(result).toEqual(resposta);
    });
  });
});
