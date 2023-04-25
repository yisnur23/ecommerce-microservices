export default () => {
  return {
    port: +process.env.PORT || 8002,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: +process.env.REDIS_PORT || 6379,
    },
    productsServiceUrl: process.env.PRODUCTS_SERVICE_URL,
  };
};
