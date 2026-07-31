import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Usuario } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            buscaEmail: jest.fn(),
            procuraId: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(UserService);
    repository = module.get(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('deve buscar usuário pelo email', async () => {
    const usuario = {
      usuarioId: 3,
      email: 'admin@admin.com',
    } as Usuario;

    repository.buscaEmail.mockResolvedValue(usuario);

    const result = await service.findByEmail('admin@admin.com');

    expect(repository.buscaEmail).toHaveBeenCalledWith('admin@admin.com');
    expect(result).toEqual(usuario);
  });

  it('deve retornar null quando o email não existir', async () => {
    repository.buscaEmail.mockResolvedValue(null);

    const result = await service.findByEmail('naoexiste@email.com');

    expect(result).toBeNull();
  });

  it('deve buscar usuário pelo id', async () => {
    const usuario = {
      usuarioId: 3,
      email: 'admin@admin.com',
    } as Usuario;

    repository.procuraId.mockResolvedValue(usuario);

    const result = await service.findById(3);

    expect(repository.procuraId).toHaveBeenCalledWith(3);
    expect(result).toEqual(usuario);
  });

  it('deve retornar null quando o id não existir', async () => {
    repository.procuraId.mockResolvedValue(null);

    const result = await service.findById(999);

    expect(result).toBeNull();
  });
});