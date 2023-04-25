import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/products.entity';

@Injectable()
export class ProductRepository extends Repository<Product> {
  constructor(dataSource: DataSource) {
    super(Product, dataSource.createEntityManager());
  }

  findById(id: string) {
    return this.findOneBy({
      id,
    });
  }

  getUserProducts(userId: string) {
    return this.find({
      where: {
        user_id: userId,
      },
    });
  }
}
