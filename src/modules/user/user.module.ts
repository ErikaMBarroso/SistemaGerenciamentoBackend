import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
@Module({
   imports: [TypeOrmModule.forFeature([Usuario])],
   providers: [UserService],
   exports: [UserService],
   controllers: [UserController] 
    
})
export class UserModule {}
