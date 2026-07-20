import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './config/config.swagger';
import { corsConfig } from './config/config.cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(corsConfig());
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  
  const config = swaggerConfig();

  const documenter = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documenter);


  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
