import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CriaCategoria } from './dto/criaCategoria.dto';
import { AtualizaCategoria } from './dto/atualizaCategoria.dto';

@Controller('categoria')
export class CategoriaController {
    constructor(private readonly categoriaService: CategoriaService){}

    @Post()
    criaCategoria(@Body() dto: CriaCategoria){
        return this.categoriaService.criaCategoria(dto);
    }

    @Get()
    consultaCategoria(){
        return this.categoriaService.consultaCategoria();
    }

    @Get(':id')
    consultaCategoriaUnica(@Param ('id', ParseIntPipe) id: number,){
            return this.categoriaService.consultaUnicaCategoria(id);
    }

    @Put(':id')
    atualizaCategoria(
        @Param('id', ParseIntPipe) id: number, @Body() dto: AtualizaCategoria,
    ) {
        return this.categoriaService.atualizaCategoria(id, dto);
    }

    @Delete(':id')
    deletaCategoria(@Param('id', ParseIntPipe) id: number){
        return this.categoriaService.deletaCategoria(id)
    }
    

}
