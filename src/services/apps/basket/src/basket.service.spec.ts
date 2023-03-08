import { Test, TestingModule } from '@nestjs/testing';
import { BasketService } from './basket.service';
import { BasketRepository } from './basket.repository';

describe('BasketService', () => {
  let service: BasketService;
  let basketRepository: BasketRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BasketService,
        {
          provide: BasketRepository,
          useValue: {
            getCart: jest.fn(),
            addItemToCart: jest.fn(),
            removeItemFromCart: jest.fn(),
            emptyCart: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BasketService>(BasketService);
    basketRepository = module.get<BasketRepository>(BasketRepository);
  });

  describe('getCart', () => {
    it('should return an empty array if cart is not found', async () => {
      const userId = 'user123';
      jest.spyOn(basketRepository, 'getCart').mockResolvedValueOnce(null);
      const cart = await service.getCart(userId);
      expect(basketRepository.getCart).toHaveBeenCalledTimes(1);
      expect(cart).toEqual([]);
    });

    it('should return the cart items if cart is found', async () => {
      const userId = 'user_id';
      const cartItems = [
        {
          productName: 'name',
          productId: 'id',
          quantity: 2,
          price: 2,
        },
      ];
      jest.spyOn(basketRepository, 'getCart').mockResolvedValueOnce(cartItems);
      const cart = await service.getCart(userId);
      expect(basketRepository.getCart).toHaveBeenCalledTimes(1);
      expect(cart).toEqual(cartItems);
    });
  });

  describe('addItemToCart', () => {
    it('should call basketRepository.addItemToCart with the correct arguments', () => {
      const cartItem = {
        productName: 'name',
        productId: 'id',
        quantity: 2,
        price: 2,
      };
      const userId = 'user123';
      jest
        .spyOn(basketRepository, 'addItemToCart')
        .mockResolvedValueOnce(undefined);
      service.addItemToCart(cartItem, userId);
      expect(basketRepository.addItemToCart).toHaveBeenCalledWith(
        cartItem,
        userId,
      );
      expect(basketRepository.addItemToCart).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeItemFromCart', () => {
    it('should call basketRepository.removeItemFromCart with the correct arguments', () => {
      const productId = 'product_id';
      const userId = 'user_id';
      jest
        .spyOn(basketRepository, 'removeItemFromCart')
        .mockResolvedValueOnce(undefined);
      service.removeItemFromCart(productId, userId);
      expect(basketRepository.removeItemFromCart).toHaveBeenCalledWith(
        productId,
        userId,
      );
      expect(basketRepository.removeItemFromCart).toHaveBeenCalledTimes(1);
    });
  });

  describe('emptyCart', () => {
    it('should call basketRepository.emptyCart with the correct argument', () => {
      const userId = 'user123';
      jest
        .spyOn(basketRepository, 'emptyCart')
        .mockResolvedValueOnce(undefined);
      service.emptyCart(userId);
      expect(basketRepository.emptyCart).toHaveBeenCalledWith(userId);
      expect(basketRepository.emptyCart).toHaveBeenCalledTimes(1);
    });
  });
});
