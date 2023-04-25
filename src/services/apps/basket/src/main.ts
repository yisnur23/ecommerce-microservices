import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { BasketModule } from './basket.module';

async function bootstrap() {
  const app = await NestFactory.create(BasketModule);
  const configService = app.get(ConfigService);
  const port = configService.get('SERVER_PORT');
  await app.listen(port);
}
bootstrap();
