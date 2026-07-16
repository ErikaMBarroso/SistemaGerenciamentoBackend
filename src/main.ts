import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({origin: 'http://localhost:5173',
    credentials:true,
  });
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  
  const config = new DocumentBuilder()
  .setTitle('Sistema de Gerenciamento para Pet Shop')
  .setDescription('O Sistema de Gerenciamento para Pet Shop é uma aplicação web desenvolvida para centralizar e facilitar o gerenciamento das operações de um pet shop')
  .addBearerAuth()
  .setVersion('1.0')
  .build();

  const documenter = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documenter);


  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
