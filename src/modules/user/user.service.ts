import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/user.entity';
import { Repository } from 'typeorm';
@Injectable()
export class UserService {

    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
    ) {}

    async login(
        email: string,
        senha: string,
    ){
        const usuario = await this.usuarioRepository.findOne({
            where: { email },
        });

        if (!usuario){
            throw new UnauthorizedException(
                'Dado inválido',
            );
        }

        if (usuario.senha !== senha){
            throw new UnauthorizedException(
                'Dados inválidos',
            );
        }

        return {
            id: usuario.usuarioId,
            nome: usuario.nome,
            perfil: usuario.perfil,
        };
    }
}
