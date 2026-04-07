import IORedis from 'ioredis';

const redisUrl = process.env.REDIS_URL;

const commonOptions = {
  // BullMQ requires this to be null to avoid blocking behavior warnings
  maxRetriesPerRequest: null as null,
};

export const redis = redisUrl
  ? new IORedis(redisUrl, commonOptions)
  : new IORedis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: Number(process.env.REDIS_PORT || 6379),
      ...commonOptions,
    });
