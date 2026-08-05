import { CriaProduto } from './criaProduto.dto';
import { PartialType } from '@nestjs/swagger';

export class AtualizaProduto extends PartialType(CriaProduto) {}
