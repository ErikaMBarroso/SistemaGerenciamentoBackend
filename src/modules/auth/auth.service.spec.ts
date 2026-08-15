import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import {
  describe,
  it,
  expect,
  beforeEach,
  jest,
  afterEach,
} from '@jest/globals';
import { UnauthorizedException } from '@nestjs/common';
import { Usuario } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

const bcryptCompareMock = bcrypt.compare as jest.MockedFunction<
  (data: string | Buffer, encrypted: string) => Promise<boolean>
>;

describe('AuthService', () => {
  let service: AuthService;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(AuthService);
    userService = module.get(UserService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('deve retornar token e dados do usuário quando credenciais estão corretas', async () => {
      const usuario = {
        usuarioId: 3,
        nome: 'Admin',
        email: 'admin@admin.com',
        senha: 'hash-armazenado',
        perfil: 'administrador',
      } as Usuario;

      userService.findByEmail.mockResolvedValue(usuario);
      bcryptCompareMock.mockResolvedValue(true);
      jwtService.signAsync.mockResolvedValue('jwt-fake-token');

      const result = await service.login('admin@admin.com', '123456');

      expect(userService.findByEmail).toHaveBeenCalledWith('admin@admin.com');
      expect(bcryptCompareMock).toHaveBeenCalledWith(
        '123456',
        'hash-armazenado',
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: 3,
        nome: 'Admin',
        perfil: 'administrador',
      });
      expect(result).toEqual({
        token_acesso: 'jwt-fake-token',
        usuario: { id: 3, nome: 'Admin', perfil: 'administrador' },
      });
    });

    it('deve lançar UnauthorizedException se o email não existir', async () => {
      userService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login('naoexiste@email.com', '123456'),
      ).rejects.toThrow(UnauthorizedException);
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });

    it('deve lançar UnauthorizedException se a senha estiver incorreta', async () => {
      const usuario = {
        usuarioId: 3,
        nome: 'Admin',
        email: 'admin@admin.com',
        senha: 'hash-armazenado',
        perfil: 'administrador',
      } as Usuario;

      userService.findByEmail.mockResolvedValue(usuario);
      bcryptCompareMock.mockResolvedValue(false);

      await expect(
        service.login('admin@admin.com', 'senha-errada'),
      ).rejects.toThrow(UnauthorizedException);
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });
  });
});
