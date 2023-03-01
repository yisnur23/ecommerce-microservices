export class CartItemDto {
  productName: string;
  productId: string;
  quantity: number;
  price: number;
}

export class UpdateItemQuantityDto {
  quantity: number;
}
