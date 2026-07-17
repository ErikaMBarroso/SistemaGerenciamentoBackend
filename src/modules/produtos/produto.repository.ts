import {  Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Produto } from "./entities/produto.entity";
import { Repository } from "typeorm";

@Injectable()
export class ProdutoRepository{
    constructor (
        @InjectRepository(Produto)
        private readonly repository: Repository<Produto> 
    ){}

    achaPorId(produtoId: number){
         return this.repository.findOne({
        where: { produtoId },
    });
    }

    salvar(produto: Produto){
        return this.repository.save(produto);
    }

    estoqueQuantidadeAtual(){
        return this.repository.createQueryBuilder('p')
            .where('p.ativo = true')
            .select('p.nome','nome')
            .addSelect('p.quantidade', 'total')
            .getRawMany();
    }

    estoqueBaixo(){
        return this.repository.createQueryBuilder('q')
            .where('q.quantidade <= q.quantidadeMin')
            .andWhere('q.ativo = true')
            .orderBy('q.quantidade', 'ASC')
            .getMany();
    }

    async semMovimentacao(dias: number){
        const dataLimite = new Date();
        dataLimite.setDate(dataLimite.getDate() - dias);

        return this.repository.manager.createQueryBuilder(Produto, 'p')
            .leftJoin('p.movimentacao', 'mov')
            .where('p.ativo = true')
            .groupBy('p.produtoId')
            .having('MAX(mov.dataMovimentacao) < :dataLimite', {dataLimite})
            .orHaving('MAX(mov.dataMovimentacao) IS NULL')
            .getMany();

    }
}