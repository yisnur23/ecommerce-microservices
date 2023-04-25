import { Payment } from '../payment.entity';

export default () => {
  return {
    port: +process.env.PORT || 8002,
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
      entities: [Payment],
    },
    stripeKey: process.env.STRIPE_API_KEY,
    stripeWebHookSecret: process.env.STRIPE_WEB_HOOK_KEY,
  };
};
