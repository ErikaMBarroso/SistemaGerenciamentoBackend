import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovimentacaoEstoque } from './entities/movimentacao.entity';
import { Repository } from 'typeorm';
import { Produto } from '../produtos/entities/produto.entity';
import {TotalPorTipo} from './interface/interfaceTipo';
import { TotalPorNome } from './interface/interfaceNome';
import { MovimentacaoDto } from './dto/movimentacao.dto';
import { MovimentacaoRepository } from './movimentacao.repository';
import { ProdutoRepository } from '../produtos/produto.repository';
@Injectable()
export class MovimentacaoService {
    constructor(

        private readonly movimentacaoRepository: MovimentacaoRepository,

        private readonly produtoRepository: ProdutoRepository,
    ){}

    async criaMovimentacao(dto: MovimentacaoDto, usuarioId: number): Promise<MovimentacaoEstoque>{
        try{
            const produto = await this.produtoRepository.achaPorId(dto.produtoId);
            if (!produto){
                throw new NotFoundException('Produto não encontrado');
            }
            if (!produto.ativo){
                throw new BadRequestException('Porduto já está desativo');
            }

            if ( dto.tipo === 'saida'){
                if(produto.quantidade < dto.quantidade){
                    throw new BadRequestException(
                        `Estoque insuficiente. Disponivel: ${produto.quantidade}`
                    );
                }
                
                produto.quantidade -= dto.quantidade;
            } else {
                produto.quantidade += dto.quantidade;
            }

            return await this.movimentacaoRepository.criaMovimentacao(
                produto, dto, usuarioId,);
            
            
        }
        catch(error){
            console.error(error);
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Erro ao registrar movimentação');
        }
        
    }

    async consultaMovimentacao(): Promise<TotalPorTipo[]>{
        try{ return this.movimentacaoRepository.consultaMovimentacao()
            

        }catch(error){
            console.log(error);
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Erro ao buscar movimentacao');
        }
    }

    async consultaMovimentacaoIndividual(produtoId: number): Promise<MovimentacaoEstoque[]>{
        try{ return  this.movimentacaoRepository.consultaMovimentacaoIndividual(produtoId);

        }catch(error){
            console.log(error);
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Erro ao buscar movimentacao');
        }
    }

        async estoqueQuantidadeAtual(): Promise <TotalPorNome[]>{
        try{
            return this.produtoRepository.estoqueQuantidadeAtual()
            
            
        } catch(error){
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Erro ao buscar produto');
        }
    }
    async consultaMovimentacaoTotal(): Promise<TotalPorTipo[]>{ 
        try{ return this.movimentacaoRepository.consultaMovimentacaoTotal(); 


        }catch(error){ 
        console.log(error);
        if (error instanceof HttpException) 
            throw error; throw new InternalServerErrorException('Erro ao buscar toral'); }}


    async historicoMovimentacao(): Promise<MovimentacaoEstoque[]>{
        try{
            return  this.movimentacaoRepository.historicoMovimentacao()

        }catch (error) {
            console.log(error);
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Erro ao buscar histórico de movimentação');
        }
    }

    async estoqueBaixo(): Promise<Produto[]>{
        try{
            return  this.produtoRepository.estoqueBaixo()
            

        }catch (error) {
            console.error(error)
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Erro ao buscar estoque baixo');
        }
    
    }
    async semMovimentacao(dias: number): Promise<Produto[]>{
        try{
            return this.produtoRepository.semMovimentacao(dias);

        }catch (error) {
            console.error(error)
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Erro ao buscar produto sem movimentação');
        }
    }


}