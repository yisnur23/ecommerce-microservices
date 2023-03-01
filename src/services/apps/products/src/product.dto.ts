import { PartialType } from '@nestjs/swagger';
import { Length, Min } from 'class-validator';

export class CreateProductDto {
  @Length(2)
  title: string;
  @Length(2)
  description: string;
  @Min(0)
  price: number;
  @Min(1)
  item_count: number;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
