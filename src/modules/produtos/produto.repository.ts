import {  Injectable, Search } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Produto } from "./entities/produto.entity";
import { DataSource, Repository } from "typeorm";
import { Categoria } from "../categoria/entities/categoria.entity";
import { MovimentacaoEstoque } from "../movimentacao/entities/movimentacao.entity";
import { CriaProduto } from "./dto/criaProduto.dto";
import { ConsultaProduto } from "./dto/consultaProduto";

@Injectable()
export class ProdutoRepository{
    constructor (
        @InjectRepository(Produto)
        private readonly repository: Repository<Produto>,
        

        @InjectRepository(MovimentacaoEstoque)
        private readonly movimentacaoRepository: Repository<MovimentacaoEstoque>,
        
         private readonly dataSource: DataSource,
    ){}

    criar(produto: Partial<Produto>){
        return this.repository.create(produto);
    }


    salvar(produto: Produto){
        return this.repository.save(produto);
    }
    criarProduto(dto: CriaProduto, usuarioId: number): Promise<Produto>{
        return this.dataSource.transaction(async(manager) =>{

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
    }

    achaPorId(id: number){
         return this.repository.findOne({
        where: { produtoId: id, ativo: true },
        relations: {
            categoria: true
        }
    });
    }

    buscaPorNome(nome:string, marca?:string){
        return this.repository.findOne({
            where:{
                nome, ativo: true, ...(marca? {marca} : {})
            }
    });
    }

   

    // todos(){
    //     return this.repository.find({
    //         where:{
    //             ativo: true
    //         },
    //         relations:{
    //             categoria: true
    //         },
    //         order:{
    //             nome: 'ASC'
    //         }
    //     });
    // }

    async listaProdutos(filtro: ConsultaProduto){

        const {pesquisa, ordem = 'nome', ordemBy = 'ASC', paginas = 1, total = 10} = filtro
        const  resultado =  this.repository
            .createQueryBuilder('p')
            .leftJoinAndSelect('p.categoria', 'categoria')
            .where('p.ativo = true');
        if(pesquisa){
        resultado.andWhere('p.nome ILIKE :pesquisa', { pesquisa: `%${pesquisa}%` });
        }
        
        resultado
            .orderBy(`p.${ordem}`, ordemBy)
            .skip((paginas - 1) * total)
            .take(total);

        const [produtos, totalRegistros] = await resultado.getManyAndCount()

        return {data: produtos,
        total: totalRegistros,
        paginas,
        totalPages: Math.ceil(totalRegistros / total),
        }
    }

    


    remover(produto: Produto){
        return this.repository.remove(produto)    }

    
      contarMovimentacoes(produtoId:number){

        return this.movimentacaoRepository.count({
            where:{
                produtoId
            }
        });

    }

    async deletarProduto(produto: Produto): Promise<{mensagem: string}>{
         return  this.dataSource.transaction(async (manager) => {

            produto.quantidade = 0;
            produto.ativo = false;
            await manager.save(produto)

            const totalMovimentacoes = await manager.count(MovimentacaoEstoque,{
                    where: {produtoId: produto.produtoId},

                });

                if (totalMovimentacoes > 0){
                    return { mensagem: 'O estoque foi zerado' };
                }

                await manager.remove(produto);
                return { mensagem: 'Produto removido com sucesso' };
    });
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

    async estoqueBaixoDash(limite: number = 4): Promise<{nome: string; quantidade: number}[]>{
       const resultado = await this.repository.createQueryBuilder('p')
            .select('p.nome',  'nome')
            .addSelect('p.quantidade', 'quantidade')
            .where('p.quantidade <= p.quantidadeMin')
            .andWhere('p.ativo = true')
            .orderBy('p.quantidade', 'ASC')
            .limit(limite)
            .getRawMany();
            

            return  resultado.map((r) => ({
                nome: r.nome,
                quantidade: Number(r.quantidade),
            }));
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

    async TotalProdutos(): Promise<{totalProdutos: number, totalEstoque: number, valorEstoque: number}>{
        const resultado = await this.repository.createQueryBuilder('p')
        .select('COUNT(p.produtoId)', 'totalProdutos')
        .addSelect('COALESCE(SUM(p.quantidade), 0)', 'totalEstoque')
        .addSelect('COALESCE(SUM(p.preco * p.quantidade), 0)', 'valorEstoque')
        .where('p.ativo = true')
        .getRawOne();

        return {
            totalProdutos: Number(resultado.totalProdutos),
            totalEstoque: Number(resultado.totalEstoque),
            valorEstoque: Number(resultado.valorEstoque),
        };
   
    }
    estoqueBaixoTotal(): Promise<number> {
        return this.repository.createQueryBuilder('q')
            .where('q.quantidade <= q.quantidadeMin')
            .andWhere('q.ativo = true')
            .getCount();
    }

}