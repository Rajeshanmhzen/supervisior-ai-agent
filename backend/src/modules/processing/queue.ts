import { Queue } from 'bullmq';
import { redis } from '../../utils/redis';
import { logger } from '../../utils/logger';

export const fileQueue = new Queue('file-processing', {
  connection: redis,
});

fileQueue.on('error', (err) => {
  logger.error('Queue error', err);
});
