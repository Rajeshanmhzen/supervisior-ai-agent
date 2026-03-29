import { Worker } from 'bullmq';
import { redis } from '../../utils/redis';
import { processFile } from './processor';
import { logger } from '../../utils/logger';

new Worker(
  'file-processing',
  async (job) => {
    logger.info('Processing job', job.id, job.data);
    await processFile(job.data as { fileId: string });
  },
  { connection: redis }
);

logger.info('Worker started');
