import{
    Entity,
    PrimaryGeneratedColumn,
    Column
} from 'typeorm';

@Entity('usuario')
export class Usuario{

    @PrimaryGeneratedColumn({
        name: 'usuario_id'
    })
    usuarioId!: number;

    @Column()
    nome!: string;

    @Column()
    email!: string;

    @Column()
    senha!: string;

    @Column()
    perfil!: string;

}