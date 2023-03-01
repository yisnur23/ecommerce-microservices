import { Injectable } from '@nestjs/common';
import { CartItemDto } from './basket.dto';
import { BasketRepository } from './basket.repository';

@Injectable()
export class BasketService {
  constructor(private basketRepository: BasketRepository) {}

  async getCart(userId: string) {
    const cart = await this.basketRepository.getCart(`cart:${userId}`);
    return cart || [];
  }

  addItemToCart(cartItem: CartItemDto, userId: string) {
    return this.basketRepository.addItemToCart(cartItem, userId);
  }

  removeItemFromCart(productId: string, userId: string) {
    return this.basketRepository.removeItemFromCart(productId, userId);
  }

  emptyCart(userId: string) {
    return this.basketRepository.emptyCart(userId);
  }
}
