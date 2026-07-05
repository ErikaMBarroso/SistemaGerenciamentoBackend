import { CriaProduto } from "./criaProduto.dto";
import { PartialType} from "@nestjs/mapped-types"

export class AtualizaProduto extends PartialType(CriaProduto){}