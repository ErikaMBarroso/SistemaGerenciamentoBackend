import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Usuario } from "./entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserRepository{
    constructor(
        @InjectRepository(Usuario)
        private readonly repository: Repository<Usuario>
){}
   async buscaEmail(email: string): Promise<Usuario | null> {
        return this.repository.findOne({
            where: {email}

        });
}

    async procuraId(id: number): Promise<Usuario | null>{
        return this.repository.findOne({
            where: {usuarioId: id}
        });
    }
}