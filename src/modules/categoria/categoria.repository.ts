import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Categoria } from "./entities/categoria.entity";

@Injectable()
export class CategoriaRepository{
    constructor(
        @InjectRepository(Categoria)
        private  readonly repository: Repository<Categoria>


    ){}

    buscaNome(nome: string){
        return this.repository.findOne({
            where:{ nome }

    });
}

     buscaPorId(id: number){
        return this.repository.findOne({
            where:{ categoriaId: id }, 
            relations: { produtos: true},
        });
    }

    todos(){
        return this.repository.find({
            order: { nome:  'ASC'}
        });
    }

    criar(dto: Partial<Categoria>){
        return this.repository.create(dto);
    }

    salvar(categoria: Categoria){
        return this.repository.save(categoria);
    }


    deletaCategoria(categoria: Categoria){
        return this.repository.remove(categoria);
    }

    

}