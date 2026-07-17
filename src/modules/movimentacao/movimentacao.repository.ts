import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MovimentacaoEstoque } from "./entities/movimentacao.entity";
import { Repository } from "typeorm";

@Injectable()
export class MovimentacaoRepository{
    constructor(
        @InjectRepository(MovimentacaoEstoque)
        private readonly repository: Repository<MovimentacaoEstoque>,
    ){}

    salvar(movimentacao: MovimentacaoEstoque){
        return this.repository.save(movimentacao);
    }

    criar(dados: Partial<MovimentacaoEstoque>){
        return this.repository.create(dados);
    }
    consultaMovimentacao(){

        return this.repository.createQueryBuilder('m')
            .leftJoin('m.produto', 'p')
            .select('p.nome', 'nome')
            .addSelect('m.tipo', 'tipo')
            .addSelect('m.quantidade', 'total')
            .orderBy('m.dataMovimentacao', 'DESC')
            .getRawMany();
    }
    
    consultaMovimentacaoIndividual(produtoId: number){
        return this.repository.find(
            {
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
        }
        );
    }
    
    consultaMovimentacaoTotal() {
         return this.repository.createQueryBuilder('m') 
            .select('m.tipo', 'tipo') 
            .addSelect('SUM(m.quantidade)', 'total') 
            .groupBy('m.tipo') 
            .getRawMany();
    }

    historicoMovimentacao() {
        return this.repository.find({
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
    }


}