import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { AddressController } from './address.controller';
import { UserAddress } from './address.entity';
import { AddressRepository } from './address.repository';
import { AddressService } from './address.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserAddress]), UserModule],
  controllers: [AddressController],
  providers: [AddressService, AddressRepository],
})
export class AddressModule {}
