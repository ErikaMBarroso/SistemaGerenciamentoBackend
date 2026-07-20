import { DocumentBuilder } from "@nestjs/swagger";

 export function swaggerConfig(){ 
 return new DocumentBuilder()
  .setTitle('Sistema de Gerenciamento para Pet Shop')
  .setDescription('O Sistema de Gerenciamento para Pet Shop é uma aplicação web desenvolvida para centralizar e facilitar o gerenciamento das operações de um pet shop')
  .addBearerAuth()
  .setVersion('1.0')
  .build();
 }

// const config = swaggerConfig();