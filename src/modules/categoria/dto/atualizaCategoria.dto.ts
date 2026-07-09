import { PartialType } from "@nestjs/swagger";
import { CriaCategoria } from "./criaCategoria.dto";

export class AtualizaCategoria extends PartialType(CriaCategoria){}