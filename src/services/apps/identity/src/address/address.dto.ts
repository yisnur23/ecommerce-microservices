import { PartialType } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class CreateAddressDto {
  @Length(2)
  name: string;
  @Length(2)
  street_address: string;
  @Length(2)
  city: string;
  @Length(2)
  state: string;
  @Length(2)
  country: string;
  @Length(2)
  zip_code: string;
}

export class UpdateAddressDto extends PartialType(CreateAddressDto) {}
