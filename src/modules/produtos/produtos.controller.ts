import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { request } from 'http';

@Controller('produtos')
export class ProdutosController {

@Post()
criar(){
    return 'cria'
}

@Get()
consulta(){
    return 'consulta'
}

@Put()
editar(){
    return 'edita';
}

@Delete()
apagar(){
    return 'apaga'
}

}