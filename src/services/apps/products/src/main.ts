import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { microserviceOptions } from './grpc/microservice-options';
import { ProductsModule } from './products.module';

async function bootstrap() {
  const app = await NestFactory.create(ProductsModule);
  const configService = app.get(ConfigService);

  const port = configService.get('SERVER_PORT');

  const grpcMicroservice = app.connectMicroservice(microserviceOptions);

  await app.startAllMicroservices();

  await app.listen(port);
}
bootstrap();
