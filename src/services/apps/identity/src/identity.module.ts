import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { JwtModule } from '@nestjs/jwt';
import configuration from './config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbilityModule } from './ability/ability.module';

import { UserModule } from './user/user.module';
import { AddressModule } from './address/address.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // LoggerModule.forRoot({
    //   pinoHttp:
    //     process.env.NODE_ENV === 'development'
    //       ? {
    //           transport: {
    //             target: 'pino-pretty',
    //             options: {
    //               singleLine: true,
    //             },
    //           },
    //         }
    //       : {},
    // }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/identity/.env',
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
    AuthModule,
    AbilityModule,
    UserModule,
    AddressModule,
  ],
})
export class IdentityModule {}
