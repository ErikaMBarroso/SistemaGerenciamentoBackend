import { ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Produto } from './entities/produto.entity';
import { Repository } from 'typeorm';
import { CriaProduto } from './dto/criaProduto.dto';
import { AtualizaProduto } from './dto/atualizaProduto.dto';

@Injectable()
export class ProdutosService {
    constructor(
        @InjectRepository(Produto)
        private produtoRepository: Repository<Produto>
    ){}

    async criar(dto: CriaProduto): Promise<Produto>{
        try{
           const existe = await this.produtoRepository.findOne({
            where: { nome: dto.nome},
           });

           if(existe){
                throw new ConflictException('Produto já cadastrado');
           }
           const produto = this.produtoRepository.create(dto);
           return await this.produtoRepository.save(produto)

        } catch (error) {
    console.error(error);
    throw error;
}
    }

    async consultaTodos(): Promise<Produto[]> {
        return this.produtoRepository.find();
    }

    async consultaUnica(id: number): Promise<Produto> {
        const produto = await this.produtoRepository.findOne({ where: { produtoID: id }, });
        if (!produto){
            throw new NotFoundException("Produto não encontrado")
        }
        return produto;
    }

    async atualizar(id: number, dto: AtualizaProduto): Promise<Produto>{
        try {
            const produto = await this.consultaUnica(id);

            Object.assign(produto, dto);
            return await this.produtoRepository.save(produto);
        } catch (error){
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Erro ao atualizar produto');
        }
    }


    async deleta(id: number):  Promise<{mensagem: string}>{
            const produto = await this.consultaUnica(id);

            await this.produtoRepository.remove(produto);

            return{ mensagem: 'produto removido'};
    }
}
