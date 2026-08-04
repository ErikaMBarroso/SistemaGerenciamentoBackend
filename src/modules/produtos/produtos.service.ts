import { ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Produto } from './entities/produto.entity';
import { Repository } from 'typeorm';
import { CriaProduto } from './dto/criaProduto.dto';
import { AtualizaProduto } from './dto/atualizaProduto.dto';
import { Categoria } from '../categoria/entities/categoria.entity';
import { MovimentacaoEstoque } from '../movimentacao/entities/movimentacao.entity';
import { ProdutoRepository } from './produto.repository';
import { ConsultaProduto } from './dto/consultaProduto';

@Injectable()
export class ProdutosService {
    constructor(
         private readonly produtoRepository: ProdutoRepository,

        @InjectRepository(Categoria)
        private categoriaRepository: Repository<Categoria>,
    ){}

    async criar(dto: CriaProduto, usuarioId: number): Promise<Produto>{
        try{

        const existe = await this.produtoRepository.buscaPorNome(dto.nome, dto.marca);
        
        if (existe){
            throw new ConflictException('Produto já cadastrado');
        }

        const categoria = await this.categoriaRepository.findOne({
            where: { categoriaId: dto.categoriaId},
        });

        if (!categoria){
            throw new NotFoundException("Categoria não encontrada")
        }
         return await this.produtoRepository.criarProduto(dto, usuarioId);
            
    }
         catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Erro ao criar produto');
        }
    }
 

    // async consultaTodos(): Promise<Produto[]> {
    //     try{
    //        return await this.produtoRepository.todos();
    //     } catch(error){
    //         if (error instanceof HttpException) throw error;
    //         throw new InternalServerErrorException('Erro ao buscar produtos');
    //     }
    // }
    async listar(filtro: ConsultaProduto){
        try{
            return await this.produtoRepository.listaProdutos(filtro);
        }
        catch(error){
        console.log(error)
        if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Erro ao buscar produtos');

    }
    }

    async consultaUnica(id: number): Promise<Produto> {
        try{
        const produto = await this.produtoRepository.achaPorId(id);
        if (!produto){
            throw new NotFoundException("Produto não encontrado")
        }
        return produto;
    } catch(error){
        if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Erro ao buscar produtos');

    }
    }

    async TotalProdutos(){
        try{
            return await this.produtoRepository.TotalProdutos()

        } catch(error){
            console.log(error)
        if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Erro ao buscar total de produtos');

    }
    }

    async estoqueBaixoTotal(){
        try{
            return await this.produtoRepository.estoqueBaixoTotal();
            
        }catch(error){
        if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Erro ao buscar total de produtos');
    }
    }
    
    async estoqueBaixoDash(){
        try{
            return await this.produtoRepository.estoqueBaixoDash();
        }
        catch(error){
        if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Erro ao buscar resumo de estoque baixo');
    }
    }

    async atualizar(id: number, dto: AtualizaProduto): Promise<Produto>{
        try {
            const produto = await this.consultaUnica(id);

            if(dto.nome && dto.nome !== produto.nome){
                const duplicado = await this.produtoRepository.buscaPorNome(dto.nome);

                if (duplicado){
                    throw new ConflictException('Já existe um produto com esse nome');
                }
            }

            if(dto.categoriaId){
                const categoria = await this.categoriaRepository.findOne({
                    where: {categoriaId: dto.categoriaId}
                });
                if (!categoria){
                    throw new NotFoundException('Categoria não encontrada')
                }
            }

            Object.assign(produto, dto);
            return await this.produtoRepository.salvar(produto);
        } catch (error){
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Erro ao atualizar produto');
        }
    }


    async deleta(id: number):  Promise<{mensagem: string}>{
        try{ 
            const produto = await this.consultaUnica(id);

            return await this.produtoRepository.deletarProduto(produto);
            

            
    } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Erro ao remover produto');
        }
}
}