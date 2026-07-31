import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { Usuario } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<Repository<Usuario>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(UserService);
    repository = module.get(getRepositoryToken(Usuario));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('deve buscar usuário pelo email', async () => {
    const usuario = {
      usuarioId: 3,
      email: 'admin@admin.com',
    } as Usuario;

    repository.findOne.mockResolvedValue(usuario);

    const result = await service.findByEmail('admin@admin.com');

    expect(repository.findOne).toHaveBeenCalledWith({
      where: {
        email: 'admin@admin.com',
      },
    });

    expect(result).toEqual(usuario);
  });

  it('deve retornar null quando o email não existir', async () => {
    repository.findOne.mockResolvedValue(null);

    const result = await service.findByEmail('naoexiste@email.com');

    expect(result).toBeNull();
  });

  it('deve buscar usuário pelo id', async () => {
    const usuario = {
      usuarioId: 3,
      email: 'admin@admin.com',
    } as Usuario;

    repository.findOne.mockResolvedValue(usuario);

    const result = await service.findById(3);

    expect(repository.findOne).toHaveBeenCalledWith({
      where: {
        usuarioId: 3,
      },
    });

    expect(result).toEqual(usuario);
  });
});