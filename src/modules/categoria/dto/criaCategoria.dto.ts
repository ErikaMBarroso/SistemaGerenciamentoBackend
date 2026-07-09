import { IsString, MaxLength } from "class-validator";

export class CriaCategoria{

    @IsString()
    @MaxLength(100)
    nome!: string;
}