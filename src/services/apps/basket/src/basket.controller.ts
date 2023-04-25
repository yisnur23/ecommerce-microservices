import { User } from '@app/decorators/user.decorator';
import { AuthenticatedUser } from '@app/types/user.type';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AddProductToCartDto, CartItemDto } from './basket.dto';
import { BasketService } from './basket.service';

@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Get()
  getCart(@User() user: AuthenticatedUser) {
    return this.basketService.getCart(user.id);
  }

  @Post()
  addItemToCart(
    @Body() cartItem: AddProductToCartDto,
    @User() user: AuthenticatedUser,
  ) {
    return this.basketService.addItemToCart(cartItem, user.id);
  }

  @Delete(':productId')
  removeItemFromCart(
    @Param('productId') productId: string,
    @User() user: AuthenticatedUser,
  ) {
    return this.basketService.removeItemFromCart(productId, user.id);
  }

  @Delete()
  emptyCart(@User() user: AuthenticatedUser) {
    return this.basketService.emptyCart(user.id);
  }
}
