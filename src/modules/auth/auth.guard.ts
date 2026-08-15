import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException('Usuário não existe');
    }
    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException('Usuário não existe');
    }

    if (err || !user) {
      throw new UnauthorizedException('Não autorizado');
    }
    return user;
  }
}
