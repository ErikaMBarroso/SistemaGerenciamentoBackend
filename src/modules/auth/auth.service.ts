import { HttpException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {

    constructor(
        private usuarioService: UserService,
        private jwtService: JwtService,
    ) {}

    async login(email: string,senha: string){
     try{
   
        const usuario = await this.usuarioService.findByEmail(email);

        if (!usuario){
            throw new UnauthorizedException('Dado inválido',);
        }

        if (usuario.senha !== senha){
            throw new UnauthorizedException('Dados inválidos',);
        }
        const payload = {
            sub: usuario.usuarioId,
            nome: usuario.nome,
            perfil: usuario.perfil,
        }

        const token_acesso = await this.jwtService.signAsync(payload);
        
        return {
            token_acesso,
            usuario: {
                id: usuario.usuarioId,
                nome: usuario.nome,
                perfil: usuario.perfil,
            },
        };
    } catch (error) {
      if (error instanceof HttpException){
        throw error;
      }
      throw new InternalServerErrorException('Erro interno do servido')
        
    }

    }
}
