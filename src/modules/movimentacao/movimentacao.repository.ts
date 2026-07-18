import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MovimentacaoEstoque } from "./entities/movimentacao.entity";
import { DataSource, Repository } from "typeorm";
import { Produto } from "../produtos/entities/produto.entity";
import { MovimentacaoDto } from "./dto/movimentacao.dto";

@Injectable()
export class MovimentacaoRepository{
    constructor(
        @InjectRepository(MovimentacaoEstoque)
        private readonly repository: Repository<MovimentacaoEstoque>,
        
        private readonly dataSource: DataSource,
        
    ){}

    salvar(movimentacao: MovimentacaoEstoque){
        return this.repository.save(movimentacao);
    }

    criar(dados: Partial<MovimentacaoEstoque>){
        return this.repository.create(dados);
    }

    criaMovimentacao(produto: Produto, dto: MovimentacaoDto, usuarioId: number): Promise<MovimentacaoEstoque>{
        return this.dataSource.transaction(async (manager) => {
            await manager.save(produto);

            const movimentacao = manager.create(MovimentacaoEstoque, {
                tipo: dto.tipo,
                quantidade: dto.quantidade,
                dataMovimentacao:  new Date(),
                produtoId: dto.produtoId,
                usuarioId,
            });
            return await manager.save(movimentacao);
        });
        

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