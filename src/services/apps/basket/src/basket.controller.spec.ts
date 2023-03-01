import { Test, TestingModule } from '@nestjs/testing';
import { BasketController } from './basket.controller';
import { BasketService } from './basket.service';

describe('BasketController', () => {
  let basketController: BasketController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BasketController],
      providers: [BasketService],
    }).compile();

    basketController = app.get<BasketController>(BasketController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(basketController.getHello()).toBe('Hello World!');
    });
  });
});
