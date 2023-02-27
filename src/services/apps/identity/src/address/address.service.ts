import { Injectable, NotFoundException } from '@nestjs/common';
import { AddressRepository } from './address.repository';
import { CreateAddressDto, UpdateAddressDto } from './address.dto';
import { Resource } from '@app/decorators/resource.decorator';
import { UserAddress } from './address.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AddressService {
  constructor(
    private addressRepository: AddressRepository,
    private userService: UserService,
  ) {}

  async createAddress(address: CreateAddressDto, userId: string) {
    const user = await this.userService.findUserById(userId);

    return this.addressRepository.save({ ...address, user });
  }

  async findAllAddresses(userId: string) {
    return this.addressRepository.findAddressesByUserId(userId);
  }

  async findAddressById(id: string, address?: UserAddress) {
    if (!address) {
      throw new NotFoundException(`address with id ${id} not found`);
    }

    return address;
  }

  async updateAddress(
    id: string,
    update: UpdateAddressDto,
    @Resource() address?: UserAddress,
  ) {
    if (!address) {
      throw new NotFoundException(`address with id ${id} not found`);
    }

    return this.addressRepository.save({
      ...address,
      ...update,
    });
  }

  async deleteAddress(id: string, @Resource() address?: UserAddress) {
    if (!address) {
      throw new NotFoundException(`address with id ${id} not found`);
    }
    return this.addressRepository.remove(address);
  }
}
