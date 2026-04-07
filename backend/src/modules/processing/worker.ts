import { Worker } from 'bullmq';
import { redis } from '../../utils/redis';
import { processFile } from './processor';
import { logger } from '../../utils/logger';

const worker = new Worker(
  'file-processing',
  async (job) => {
    logger.info('Processing job', job.id, job.data);
    try {
      await processFile(job.data as { fileId: string });
    } catch (err: any) {
      logger.error('Job processing error', err);
      throw err;
    }
  },
  { connection: redis }
);

worker.on('failed', (job, err) => {
  logger.error('Job failed', job?.id, err);
});

worker.on('error', (err) => {
  logger.error('Worker error', err);
});

logger.info('Worker started');
