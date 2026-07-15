import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovimentacaoEstoque } from './entities/movimentacao.entity';
import { Repository } from 'typeorm';
import { Produto } from '../produtos/entities/produto.entity';
import {TotalPorTipo} from './interface/interfaceTipo';
import { TotalPorNome } from './interface/interfaceNome';
import { MovimentacaoDto } from './dto/movimentacao.dto';
@Injectable()
export class MovimentacaoService {
    constructor(
        @InjectRepository(MovimentacaoEstoque)
        private movimentacaoRepository:  Repository<MovimentacaoEstoque>,

        @InjectRepository(Produto)
        private produtoRepository : Repository<Produto>,
    ){}

    async criaMovimentacao(dto: MovimentacaoDto, usuarioId: number): Promise<MovimentacaoEstoque>{
        try{
            const produto = await this.produtoRepository.findOne({
                where: { produtoId: dto.produtoId},
            });
            if (!produto){
                throw new NotFoundException('Produto não encontrado');
            }

            if ( dto.tipo === 'saida'){
                if(produto.quantidade < dto.quantidade){
                    throw new BadRequestException(
                        `Estoque insuficiente. Disponivel: ${produto.quantidade}`
                    );
                }
            }
            
            if (dto.tipo === 'entrada'){
                produto.quantidade += dto.quantidade;
            } else{
                produto.quantidade -= dto.quantidade;
            }

            await this.produtoRepository.save(produto);

            const movimentacao = this.movimentacaoRepository.create({
                tipo: dto.tipo,
                quantidade: dto.quantidade,
                dataMovimentacao:  new Date(),
                produtoId: dto.produtoId,
                usuarioId,
            });

            return await this.movimentacaoRepository.save(movimentacao);
        
        }
        catch(error){
            console.error(error);
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Erro ao registrar movimentação');
        }
        
    }

    async consultaMovimentacao(): Promise<TotalPorTipo[]>{
        try{ const resultado = await this.movimentacaoRepository.createQueryBuilder('m')
            .leftJoin('m.produto', 'p')
            .select('p.nome', 'nome')
            .addSelect('m.tipo', 'tipo')
            .addSelect('m.quantidade', 'total')
            .orderBy('m.dataMovimentacao', 'DESC')
            .getRawMany();
            return resultado;

        }catch(error){
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Erro ao buscar movimentacao');
        }
    }

    async consultaMovimentacaoIndividual(produtoId: number): Promise<MovimentacaoEstoque[]>{
        try{ return await this.movimentacaoRepository.find({
            where: {produtoId},
            relations: {'usuario': true},
            select:{ id: true,
                tipo: true,
                quantidade: true,
                dataMovimentacao: true,
                produtoId: true,
                usuario: {
                    perfil: true,
                },

            },
            order: {dataMovimentacao: 'ASC'},
        });

        }catch(error){
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Erro ao buscar movimentacao');
        }
    }

        async estoqueQuantidadeAtual(): Promise <TotalPorNome[]>{
        try{
            const produto = await this.produtoRepository.createQueryBuilder('p')
            .select('p.nome','nome')
            .addSelect('p.quantidade', 'total')
            .getRawMany();
            return produto;
            
        } catch(error){
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Erro ao buscar produto');
        }
    }
    async consultaMovimentacaoTotal(): Promise<TotalPorTipo[]>{ 
        try{ const resultado = await this.movimentacaoRepository.createQueryBuilder('m') 

            .select('m.tipo', 'tipo') 
            .addSelect('SUM(m.quantidade)', 'total') 
            .groupBy('m.tipo') .getRawMany(); 
            return resultado; 

        }catch(error){ 
        if (error instanceof HttpException) 
            throw error; throw new InternalServerErrorException('Erro ao buscar toral'); }}


    async historicoMovimentacao(): Promise<MovimentacaoEstoque[]>{
        try{
            return  await this.movimentacaoRepository.find({
                relations: {usuario: true, produto: true},
                select:{ id: true,
                tipo: true,
                quantidade: true,
                dataMovimentacao: true,
                produtoId: true,
                usuario: {
                    perfil: true,
                },

            },
                order: {dataMovimentacao: 'DESC'},
            });

        }catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Erro ao buscar histórico de movimentação');
        }
    }

    async estoqueBaixo(): Promise<Produto[]>{
        try{
            const baixo = await this.produtoRepository
            .createQueryBuilder('q')
            .where('q.quantidade <= q.quantidadeMin')
            .orderBy('q.quantidade', 'ASC')
            .getMany();
            return baixo;

        }catch (error) {
            console.error(error)
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Erro ao buscar estoque baixo');
        }
    
    }
    async semMovimentacao(dias: number): Promise<Produto[]>{
        try{
            const dataLimite = new Date();
            dataLimite.setDate(dataLimite.getDate() - dias);

            const sem = await this.movimentacaoRepository.manager.createQueryBuilder(Produto, 'p')
            .leftJoin('p.movimentacao', 'mov')
            .groupBy('p.produtoId')
            .having('MAX(mov.dataMovimentacao) < :dataLimite', {dataLimite})
            .orHaving('MAX(mov.dataMovimentacao) IS NULL')
            .getMany();

            return sem

        }catch (error) {
            console.error(error)
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Erro ao buscar produto sem movimentação');
        }
    }


}
