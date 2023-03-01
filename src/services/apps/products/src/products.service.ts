import { Resource } from '@app/decorators/resource.decorator';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './entities/products.entity';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductsService {
  constructor(private productRepository: ProductRepository) {}

  createProduct(body: CreateProductDto, userId: string) {
    return this.productRepository.save({
      ...body,
      user_id: userId,
    });
  }

  async getProduct(id: string) {
    const product = this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('product not found');
    }
    return product;
  }

  getAllProducts(take?: number, skip?: number) {
    return this.productRepository.find({
      take,
      skip,
    });
  }

  getUserProducts(userId: string) {
    return this.productRepository.getUserProducts(userId);
  }

  updateProduct(id: string, update: UpdateProductDto, product?: Product) {
    if (!product) {
      throw new NotFoundException('product not found');
    }

    return this.productRepository.save({
      ...product,
      ...update,
    });
  }

  deleteProduct(id: string, product?: Product) {
    if (!product) {
      throw new NotFoundException('product not found');
    }
    this.productRepository.remove(product);
  }
}
