import IORedis from 'ioredis';

const redisUrl = process.env.REDIS_URL;

export const redis = redisUrl
  ? new IORedis(redisUrl)
  : new IORedis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: Number(process.env.REDIS_PORT || 6379),
    });
