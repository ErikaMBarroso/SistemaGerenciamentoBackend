import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { Repository } from 'typeorm';
import { CriaCategoria } from './dto/criaCategoria.dto';
import { AtualizaCategoria } from './dto/atualizaCategoria.dto';
import { CategoriaRepository } from './categoria.repository';

@Injectable()
export class CategoriaService {
    constructor(
        private readonly categoriaRepository: CategoriaRepository,
    ){}
    async criaCategoria(dto:CriaCategoria ): Promise<Categoria>{
        try{
            const existe = await this.categoriaRepository.buscaNome(dto.nome);
            
            if (existe){
                throw new ConflictException('Categoria já cadastrado');
            }
            const categoria = this.categoriaRepository.criar(dto);
            return await this.categoriaRepository.salvar(categoria);
        }
        catch(error){
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('erro ao criar categoria')
        }

    }

    async consultaCategoria(): Promise<Categoria[]>{
        try{
            return  await this.categoriaRepository.todos();

            
        }catch(error){
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('erro ao consulta categoria')
        }
    }

    async consultaUnicaCategoria(id: number): Promise<Categoria> {
            try{
            const categoria = await this.categoriaRepository.buscaPorId(id)
            if (!categoria){
                throw new NotFoundException("Categoria não encontrado")
            }
            return categoria;
        } catch(error){
            if (error instanceof HttpException) throw error;
                throw new InternalServerErrorException('Erro ao buscar categoria');
    
        }
        }

    async categoriasCadastrada(){
        try{
            return await this.categoriaRepository.categoriasCadastradas();

        }catch(error){
            if (error instanceof HttpException) throw error;
                throw new InternalServerErrorException('Erro ao buscar total de categoria');
    
        }
    }

    async graficoBarras(){
        try{
                return await this.categoriaRepository.graficoBarras();
        }
        catch(error){
            if (error instanceof HttpException) throw error;
                throw new InternalServerErrorException('Erro ao buscar total de categoria para o Grafico de Barras');
    
        }
    }

    async atualizaCategoria(id: number, dto: AtualizaCategoria ): Promise<Categoria>{
        try{
            const categoria = await this.consultaUnicaCategoria(id);

            if(dto.nome && dto.nome !== categoria.nome){
                const duplicado = await this.categoriaRepository.buscaNome(dto.nome)

                if(duplicado){
                    throw new ConflictException('Já existe categoria com esse nome ')
                }
            }
            Object.assign(categoria, dto);
            return await this.categoriaRepository.salvar(categoria);


        } catch(error){
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('erro ao consulta categoria')
        }
    }

    async deletaCategoria(id: number): Promise<{mensagem: string}>{
        try{

            const categoria = await this.consultaUnicaCategoria(id);

            if (categoria.produtos && categoria.produtos.length > 0){
                throw new BadRequestException(
                     `Categoria possui ${categoria.produtos.length} produto vinculado e não pode ser apagada`
                );
            }

            await this.categoriaRepository.deletaCategoria(categoria);
            
            return { mensagem: 'categoria removida'}
        }
        catch(error){
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('erro ao remover categoria')
        }
        

    }

}
