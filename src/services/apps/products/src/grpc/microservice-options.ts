import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const microserviceOptions: MicroserviceOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'products',
    protoPath: join(process.cwd(), 'libs/proto-files/products.proto'),
    url: 'localhost:9000',
  },
};
