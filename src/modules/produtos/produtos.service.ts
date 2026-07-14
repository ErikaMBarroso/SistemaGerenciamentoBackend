import { ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Produto } from './entities/produto.entity';
import { Repository } from 'typeorm';
import { CriaProduto } from './dto/criaProduto.dto';
import { AtualizaProduto } from './dto/atualizaProduto.dto';
import { Categoria } from '../categoria/entities/categoria.entity';
import { MovimentacaoEstoque } from '../movimentacao/entities/movimentacao.entity';

@Injectable()
export class ProdutosService {
    constructor(
        @InjectRepository(Produto)
        private produtoRepository: Repository<Produto>,

        @InjectRepository(Categoria)
        private categoriaRepository: Repository<Categoria>,

        @InjectRepository(MovimentacaoEstoque)
        private movimentacaoRepository: Repository<MovimentacaoEstoque>,
    ){}

    async criar(dto: CriaProduto, usuarioId: number): Promise<Produto>{
        try{

        const existe = await this.produtoRepository.findOne({where: {nome: dto.nome, marca: dto.marca,}})
        
        if (existe){
            throw new ConflictException('Produto já cadastrado');
        }

        const categoria = await this.categoriaRepository.findOne({
            where: { categoriaId: dto.categoriaId},
        });

        if (!categoria){
            throw new NotFoundException("Categoria não encontrada")
        }
const produtoCriado  = await this.produtoRepository.manager.transaction(async(manager) => {
            const produto = manager.create(Produto, dto);
            const produtoSalvo = await manager.save(produto);

            if (dto.quantidade > 0){
                const movimentacaoInicial = manager.create(MovimentacaoEstoque, {
                    tipo: 'entrada',
                    quantidade: dto.quantidade,
                    dataMovimentacao: new Date(),
                    produtoId: produtoSalvo.produtoId,
                    usuarioId,
                });
                await manager.save(movimentacaoInicial)

            }
            
        
          return produtoSalvo;
        });
        return produtoCriado 
        
        
    }
         catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Erro ao criar produto');
        }
    }

    async consultaTodos(): Promise<Produto[]> {
        try{
           return await this.produtoRepository.find({
               relations: { "categoria": true},
               order: {nome: 'ASC'},

           });
        } catch(error){
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Erro ao buscar produtos');
        }
    }

    async consultaUnica(id: number): Promise<Produto> {
        try{
        const produto = await this.produtoRepository.findOne({ 
            where: { produtoId: id }, relations: {'categoria': true} });

        if (!produto){
            throw new NotFoundException("Produto não encontrado")
        }
        return produto;
    } catch(error){
        if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Erro ao buscar produtos');

    }
    }

    async atualizar(id: number, dto: AtualizaProduto): Promise<Produto>{
        try {
            const produto = await this.consultaUnica(id);

            if(dto.nome && dto.nome !== produto.nome){
                const duplicado = await this.produtoRepository.findOne({where: { nome: dto.nome}});
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
            return await this.produtoRepository.save(produto);
        } catch (error){
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Erro ao atualizar produto');
        }
    }


    async deleta(id: number):  Promise<{mensagem: string}>{
        try{
            const produto = await this.consultaUnica(id);
            
            const totalMovimentacoes = await this.movimentacaoRepository.count({
                where: { produtoId: id },
            });

            if(totalMovimentacoes > 0) {
                throw new ConflictException( 'Não é possivel remover: este produto está em movimentação');
            }

            await this.produtoRepository.remove(produto);
        
            return{ mensagem: 'produto removido'};
    } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Erro ao remover produto');
        }
}
}