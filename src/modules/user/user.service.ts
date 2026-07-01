import { HttpException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UserService {

    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
        private jwtService: JwtService,
    ) {}

    async login(email: string,senha: string){
     try{
   
        const usuario = await this.usuarioRepository.findOne({
            where: { email },
        });

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
