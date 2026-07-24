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

    async movimentacaoHoje():  Promise<{entradas:number; saidas: number}>{
        const inicioHoje = new Date();
        inicioHoje.setHours(0, 0, 0, 0);
        
        const fimHoje = new Date(inicioHoje);
        fimHoje.setDate(fimHoje.getDate() + 1);

        const resultadoHoje = await this.repository.createQueryBuilder('m')
        .select('m.tipo', 'tipo')
        .addSelect('COUNT(m.id)', 'total')
        .where('m.dataMovimentacao >= :inicioHoje AND m.dataMovimentacao < :fimHoje', { inicioHoje, fimHoje })
        .groupBy('m.tipo')
        .getRawMany();

        const mapa = new Map(resultadoHoje.map((r) => [r.tipo, Number(r.total)]));

        return {
            entradas: mapa.get('entrada') ?? 0,
            saidas :  mapa.get('saida') ?? 0,
        };
    }

    async produtoMaisVendidos(limite: number = 4): Promise<{nome: string; quantidadeVendida: number}[]>{
       const resultado = await this.repository.createQueryBuilder('m')
            .innerJoin('m.produto', 'p')
            .select('p.nome', 'nome')
            .addSelect('SUM(m.quantidade)', 'quantidadeVendida')
            .where('m.tipo = :tipo', {tipo: 'saida'})
            .addGroupBy('p.nome')
            .orderBy('"quantidadeVendida"', 'DESC')
            .limit(limite)
            .getRawMany();
            

            return  resultado.map((r) => ({
                nome: r.nome,
                quantidadeVendida: Number(r.quantidadeVendida),
            }));
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