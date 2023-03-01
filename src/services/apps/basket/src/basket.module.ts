import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { BasketController } from './basket.controller';
import { BasketService } from './basket.service';
import configuration from './config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@app/auth/jwt/jwt.guard';
import { JwtStrategy } from './passport/jwt.strategy';
import { BasketRepository } from './basket.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/basket/.env',
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
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): RedisModuleOptions => ({
        config: configService.get('redis'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [BasketController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    JwtStrategy,
    BasketService,
    BasketRepository,
  ],
})
export class BasketModule {}
