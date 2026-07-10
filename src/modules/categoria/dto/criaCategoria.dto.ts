import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength } from "class-validator";

export class CriaCategoria{

    @ApiProperty({example: 'Comida', maxLength: 100})
    @IsString()
    @MaxLength(100)
    nome!: string;
}