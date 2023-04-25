import { IProductGrpcService } from '@app/types/interfaces/products.interface';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { AddProductToCartDto, CartItemDto } from './basket.dto';
import { BasketRepository } from './basket.repository';

@Injectable()
export class BasketService implements OnModuleInit {
  private productGrpcService: IProductGrpcService;
  constructor(
    private basketRepository: BasketRepository,
    @Inject('PRODUCT_SERVICE') private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.productGrpcService = this.client.getService<IProductGrpcService>(
      'ProductsGrpcController',
    );
  }

  async getCart(userId: string) {
    const cart = await this.basketRepository.getCart(`cart:${userId}`);
    return cart || [];
  }

  async addItemToCart(cartItem: AddProductToCartDto, userId: string) {
    const product = await lastValueFrom(
      this.productGrpcService.getProduct({ id: cartItem.productId }),
    );

    const productItem = {
      productId: product.id,
      productName: product.name,
      quantity: cartItem.quantity || 1,
      price: product.price,
    };
    return this.basketRepository.addItemToCart(productItem, userId);
  }

  removeItemFromCart(productId: string, userId: string) {
    return this.basketRepository.removeItemFromCart(productId, userId);
  }

  emptyCart(userId: string) {
    return this.basketRepository.emptyCart(userId);
  }
}
