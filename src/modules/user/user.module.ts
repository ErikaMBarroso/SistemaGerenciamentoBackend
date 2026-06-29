import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
@Module({
    imports:[
        TypeOrmModule.forFeature([Usuario])
    ],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
