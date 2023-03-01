import { Product } from '../entities/products.entity';

export default () => {
  return {
    port: +process.env.PORT || 8000,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
    database: {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: process.env.NODE_ENV === 'development',
      logging: false,
      entities: [Product],
    },
  };
};
