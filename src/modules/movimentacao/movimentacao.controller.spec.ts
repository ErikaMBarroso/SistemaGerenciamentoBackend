import { Test, TestingModule } from '@nestjs/testing';
import { MovimentacaoController } from './movimentacao.controller';

describe('MovimentacaoController', () => {
  let controller: MovimentacaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovimentacaoController],
    }).compile();

    controller = module.get<MovimentacaoController>(MovimentacaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
