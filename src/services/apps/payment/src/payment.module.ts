import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import configuration from './config';
import { StripeModule } from 'nestjs-stripe';
import { PaymentRepository } from './payment.repository';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@app/auth/jwt/jwt.guard';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/payment/.env',
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
    StripeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.get('stripeKey'),
        apiVersion: '2022-11-15',
      }),
    }),
  ],
  controllers: [PaymentController],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
    JwtStrategy,
    PaymentService,
    PaymentRepository,
  ],
})
export class PaymentModule {}
