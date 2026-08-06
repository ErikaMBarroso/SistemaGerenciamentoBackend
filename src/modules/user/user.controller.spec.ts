import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { LoginDto } from '../user/dto/dto.login';
import { ThrottlerGuard } from '@nestjs/throttler';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('deve chamar authService.login com email e senha do body', async () => {
      const dto: LoginDto = { email: 'admin@admin.com', senha: '123456' };
      const resposta = {
        token_acesso: 'jwt-fake-token',
        usuario: { id: 1, nome: 'Admin', perfil: 'administrador' },
      };
      authService.login.mockResolvedValue(resposta as any);

      const result = await controller.login(dto);

      expect(authService.login).toHaveBeenCalledWith(dto.email, dto.senha);
      expect(result).toEqual(resposta);
    });

    it('deve propagar o erro lançado pelo authService', async () => {
      const dto: LoginDto = { email: 'errado@errado.com', senha: 'errada' };
      authService.login.mockRejectedValue(new Error('Não autorizado'));

      await expect(controller.login(dto)).rejects.toThrow('Não autorizado');
    });
  });
});
