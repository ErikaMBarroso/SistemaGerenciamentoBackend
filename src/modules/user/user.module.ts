import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from 'process';
@Module({
    imports:[
        TypeOrmModule.forFeature([Usuario]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET'),
                signOptions:{
                    expiresIn: config.get<string>('JWT_EXPIRES_IN') as any,
                },
            }),
        }),
    ],
    controllers: [UserController],
    providers: [UserService],
    
})
export class UserModule {}
