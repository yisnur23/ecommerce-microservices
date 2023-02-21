import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { IdentityModule } from './identity.module';
import sourceMapSupport from 'source-map-support';

async function bootstrap() {
  const app = await NestFactory.create(IdentityModule);
  const configService = app.get(ConfigService);
  const port = configService.get('SERVER_PORT');
  await app.listen(port);
}

sourceMapSupport.install();

bootstrap();
