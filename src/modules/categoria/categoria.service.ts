import { ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { Repository } from 'typeorm';
import { CriaCategoria } from './dto/criaCategoria.dto';
import { AtualizaCategoria } from './dto/atualizaCategoria.dto';

@Injectable()
export class CategoriaService {
    constructor(
        @InjectRepository(Categoria)
        private categoriaRepository: Repository<Categoria>
    ){}
    async criaCategoria(dto:CriaCategoria ): Promise<Categoria>{
        try{
            const existe = await this.categoriaRepository.findOne({ where: {nome: dto.nome}})
            if(existe){
                throw new ConflictException('Categoria já cadastrado');
            }
            const categoria = this.categoriaRepository.create(dto);
            return await this.categoriaRepository.save(categoria);
        }
        catch(error){
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('erro ao criar categoria')
        }

    }

    async consultaCategoria(): Promise<Categoria[]>{
        try{
            return  await this.categoriaRepository.find({
                order: { nome: 'ASC'}
            });

            
        }catch(error){
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('erro ao consulta categoria')
        }
    }

    async consultaUnicaCategoria(id: number): Promise<Categoria> {
            try{
            const categoria = await this.categoriaRepository.findOne({ 
                where: { categoriaId: id }, relations: { produtos: true}, });
            if (!categoria){
                throw new NotFoundException("Categoria não encontrado")
            }
            return categoria;
        } catch(error){
            if (error instanceof HttpException) throw error;
                throw new InternalServerErrorException('Erro ao buscar categoria');
    
        }
        }

    async atualizaCategoria(id: number, dto: AtualizaCategoria ): Promise<Categoria>{
        try{
            const categoria = await this.consultaUnicaCategoria(id);

            if(dto.nome && dto.nome !== categoria.nome){
                const duplicado = await this.categoriaRepository.findOne({where: { nome:dto.nome}});


                if(duplicado){
                    throw new ConflictException('Já existe categoria com esse nome ')
                }
            }
            Object.assign(categoria, dto);
            return await this.categoriaRepository.save(categoria);


        } catch(error){
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('erro ao consulta categoria')
        }
    }

    async deletaCategoria(id: number): Promise<{mensagem: string}>{
        try{

            const categoria = await this.consultaUnicaCategoria(id);

            await this.categoriaRepository.remove(categoria);

            return { mensagem: 'categoria removida'}
        }
        catch(error){
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('erro ao remover categoria')
        }
        

    }

}
