import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { User } from '@app/decorators/user.decorator';
import { AuthenticatedUser } from '@app/types/user.type';
import { CheckAbility } from '@app/auth/decorators/ability.decorator';
import { UserAddress } from './address.entity';
import { UserAddressAbility } from './address.ability';
import { CreateAddressDto, UpdateAddressDto } from './address.dto';
import { AddressService } from './address.service';
import { Resource } from '@app/decorators/resource.decorator';

@Controller('me/addresses')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Post()
  @CheckAbility(UserAddressAbility.Create)
  async createAddress(
    @Body() address: CreateAddressDto,
    @User() user: AuthenticatedUser,
  ) {
    return this.addressService.createAddress(address, user.id);
  }
  @Get()
  @CheckAbility(UserAddressAbility.Read)
  async findAllAddresses(
    @User() user: AuthenticatedUser,
  ): Promise<UserAddress[]> {
    return this.addressService.findAllAddresses(user.id);
  }

  @Get(':id')
  @CheckAbility(UserAddressAbility.Read)
  async findAddress(@Param('id') id: string, @Resource() address: UserAddress) {
    return this.addressService.findAddressById(id, address);
  }

  @Patch(':id')
  @CheckAbility(UserAddressAbility.Update)
  async updateAddress(
    @Param('id') id: string,
    @Body() update: UpdateAddressDto,
    @Resource() address: UserAddress,
  ) {
    return this.addressService.updateAddress(id, update, address);
  }

  @Delete(':id')
  @CheckAbility(UserAddressAbility.Delete)
  async deleteAddress(
    @Param('id') id: string,
    @Resource() address: UserAddress,
  ) {
    return this.addressService.deleteAddress(id, address);
  }
}
