import { MicroserviceOptions, Transport } from '@nestjs/microservices';

export const microserviceOptions: MicroserviceOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      brokers: ['localhost:9092'],
    },
  },
};
