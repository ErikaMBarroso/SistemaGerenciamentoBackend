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

    async findByEmail(email: string): Promise<Usuario | null>{
        return this.usuarioRepository.findOne({ where: {email}});
    }

   

}
