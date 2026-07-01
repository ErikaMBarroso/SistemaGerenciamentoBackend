import { HttpException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/user.entity';
import { Repository } from 'typeorm';
@Injectable()
export class UserService {

    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
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
    
        return {
            id: usuario.usuarioId,
            nome: usuario.nome,
            perfil: usuario.perfil,
        };
    } catch (error) {
      if (error instanceof HttpException){
        throw error;
      }

      throw new InternalServerErrorException(
        'Erro interno do servido'
      )
        
    }

    }
}
