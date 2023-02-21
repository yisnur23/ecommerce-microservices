import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserAddress } from './address.entity';
@Injectable()
export class AddressRepository extends Repository<UserAddress> {
  constructor(dataSource: DataSource) {
    super(UserAddress, dataSource.createEntityManager());
  }

  findAddressById(id: string) {
    return this.findOne({
      where: {
        id,
      },
    });
  }

  findAddressesByUserId(id: string) {
    return this.find({
      where: {
        user: { id },
      },
    });
  }
}
