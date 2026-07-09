import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { UserService } from './modules/user/user.service';
import { UserController } from './modules/user/user.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { ProdutosModule } from './modules/produtos/produtos.module';
import { DatabaseModule } from './database/databaseModule';
// import { MovimentacaoModule } from './modules/movimentacao/movimentacao.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    DatabaseModule,
    UserModule,
    AuthModule,
    ProdutosModule,
    // MovimentacaoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
