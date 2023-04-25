import { IProduct, IProductId } from '@app/types/interfaces/products.interface';
import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { ProductRepository } from '../product.repository';
import { ProductsService } from '../products.service';

@Controller()
export class ProductsGrpcController {
  constructor(private productRepository: ProductRepository) {}

  @GrpcMethod('ProductsGrpcController', 'GetProduct')
  async getProduct(data: IProductId): Promise<IProduct> {
    const product = await this.productRepository.findById(data.id);
    if (!product) {
      throw new RpcException({
        code: 5,
        message: 'product not found',
      });
    }
    return product;
  }
}
