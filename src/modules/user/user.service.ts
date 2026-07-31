import { HttpException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {

    constructor(
        
        private usuarioRepository: UserRepository, 
    ) {}

    async findByEmail(email: string): Promise<Usuario | null>{
        try{ 
            return this.usuarioRepository.buscaEmail(email);
        }
        catch(error){
            console.log(error)
        if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Erro ao buscar credencial');
    }
    }

   async findById(id: number): Promise<Usuario | null>{
        try{
            return this.usuarioRepository.procuraId(id);
        }
        catch(error){
            console.log(error)
        if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Erro ao buscar credencial');
    }
    }
}
