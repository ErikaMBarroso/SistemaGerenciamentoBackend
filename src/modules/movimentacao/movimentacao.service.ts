import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovimentacaoEstoque } from './entities/movimentacao.entity';
import { Repository } from 'typeorm';
import { Produto } from '../produtos/entities/produto.entity';
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
                dataMovimentacao: dto.dataMovimentacao,
                produtoId: dto.produtoId,
                usuarioId,
            });

            return await this.movimentacaoRepository.save(movimentacao);
        
        }
        catch(error){
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Erro ao registrar movimentação');
        }
        
    }
}
