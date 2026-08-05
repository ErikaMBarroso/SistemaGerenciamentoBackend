import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/role.guard';
import { Perfis } from '../auth/auth.decorator';
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('teste')
  async teste_token(@Request() req: any) {
    return { mensagem: 'teste token', user: req.user };
  }

  @Get('permissao')
  @Perfis('administrador')
  async teste_permissao() {
    return 'teste permissao';
  }
}
