import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { CartItemDto } from './basket.dto';
import { Cart } from './cart.type';

@Injectable()
export class BasketRepository {
  private client: Redis = this.redisService.getClient();

  constructor(private redisService: RedisService) {}

  private async getJson(key: string) {
    const value = (await this.client.call('JSON.GET', key, '.')) as string;
    return JSON.parse(value) as Cart;
  }

  private async setJson(key: string, value: Cart) {
    return this.client.call('JSON.SET', key, '.', JSON.stringify(value));
  }

  getCart(cartKey: string) {
    return this.getJson(cartKey);
  }

  async addItemToCart(cartItem: CartItemDto, userId: string) {
    const cartKey = `cart:${userId}`;
    const cart = await this.getCart(cartKey);
    console.log('cart', cart);
    if (!cart) {
      const newCart = [];
      newCart.push(cartItem);
      await this.setJson(cartKey, newCart);
    } else {
      const index = cart.findIndex((i) => i.productId === cartItem.productId);

      if (index === -1) {
        cart.push(cartItem);
      } else {
        cart[index].quantity = cartItem.quantity;
      }

      await this.setJson(cartKey, cart);
    }
  }

  async removeItemFromCart(productId: string, userId: string) {
    const cartKey = `cart:${userId}`;
    const cart = await this.getCart(cartKey);

    const newCart = cart.filter((item) => item.productId !== productId);

    await this.setJson(cartKey, newCart);
  }

  async emptyCart(userId: string) {
    const cartKey = `cart:${userId}`;

    await this.setJson(cartKey, []);
  }
}
