import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp:
        process.env.NODE_ENV === 'development'
          ? {
              transport: {
                target: 'pino-pretty',
                options: {
                  singleLine: true,
                },
              },
            }
          : {},
    }),
  ],
  controllers: [],
  providers: [],
})
export class IdentityModule {}
