import { Queue } from 'bullmq';
import { redis } from '../../utils/redis';

export const fileQueue = new Queue('file-processing', {
  connection: redis,
});
