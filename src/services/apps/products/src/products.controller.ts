import { CheckAbility } from '@app/auth/decorators/ability.decorator';
import { Public } from '@app/auth/decorators/is-public.decorator';
import { JwtAuthGuard } from '@app/auth/jwt/jwt.guard';
import { Resource } from '@app/decorators/resource.decorator';
import { User } from '@app/decorators/user.decorator';
import { AuthenticatedUser } from '@app/types/user.type';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductAbilityGuard } from './ability/ability.guard';
import { Product } from './entities/products.entity';
import { ProductAbility } from './product.ability';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { ProductsService } from './products.service';

@Controller('product')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @CheckAbility(ProductAbility.Create)
  @UseGuards(JwtAuthGuard, ProductAbilityGuard)
  createProduct(
    @Body() body: CreateProductDto,
    @User() user: AuthenticatedUser,
  ) {
    return this.productsService.createProduct(body, user.id);
  }

  @Get()
  @Public()
  findAllProducts(@Query('take') take: number, @Query('skip') skip: number) {
    return this.productsService.getAllProducts(take, skip);
  }

  @Get('user_products')
  @CheckAbility(ProductAbility.Read)
  @UseGuards(JwtAuthGuard, ProductAbilityGuard)
  getUserProducts(@User() user: AuthenticatedUser) {
    return this.productsService.getUserProducts(user.id);
  }

  @Get(':id')
  @Public()
  findProduct(@Param('id') id: string) {
    return this.productsService.getProduct(id);
  }

  @Patch(':id')
  @CheckAbility(ProductAbility.Update)
  @UseGuards(JwtAuthGuard, ProductAbilityGuard)
  updateProduct(
    @Param('id') id: string,
    @Body() update: UpdateProductDto,
    @Resource() product: Product,
  ) {
    return this.productsService.updateProduct(id, update, product);
  }

  @Delete(':id')
  @CheckAbility(ProductAbility.Delete)
  @UseGuards(JwtAuthGuard, ProductAbilityGuard)
  deleteProduct(@Param('id') id: string, @Resource() product: Product) {
    return this.productsService.deleteProduct(id, product);
  }
}
