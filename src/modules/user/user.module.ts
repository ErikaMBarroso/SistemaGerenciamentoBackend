import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/user.entity';
import { UserService } from './user.service';
@Module({
   imports: [TypeOrmModule.forFeature([Usuario])],
   providers: [UserService],
   exports: [UserService],
    
})
export class UserModule {}
