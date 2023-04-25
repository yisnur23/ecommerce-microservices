import { IsOptional } from 'class-validator';

export class CartItemDto {
  productName: string;
  productId: string;
  quantity: number;
  price: number;
}

export class UpdateItemQuantityDto {
  quantity: number;
}

export class AddProductToCartDto {
  productId: string;
  @IsOptional()
  quantity?: number;
}
