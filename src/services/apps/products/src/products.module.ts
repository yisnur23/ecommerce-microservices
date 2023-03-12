import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { AbilityModule } from './ability/ability.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import configuration from './config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@app/auth/jwt/jwt.guard';
import { JwtStrategy } from './passport/jwt.strategy';
import { ProductRepository } from './product.repository';
import { ProductsGrpcController } from './grpc/product.grpc.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/products/.env',
      load: [configuration],
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwtSecret'),
        signOptions: {
          expiresIn: configService.get('jwtExpiresIn'),
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return { ...configService.get('database'), autoLoadEntities: true };
      },
      inject: [ConfigService],
    }),
    AbilityModule,
  ],
  controllers: [ProductsController, ProductsGrpcController],
  providers: [JwtStrategy, ProductsService, ProductRepository],
})
export class ProductsModule {}
