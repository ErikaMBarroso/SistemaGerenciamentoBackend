import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './databaseConfig';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...databaseConfig,
      migrations: [
        'dist/database/migrations/*.Js'],
         }),
      ],
})
export class DatabaseModule {}