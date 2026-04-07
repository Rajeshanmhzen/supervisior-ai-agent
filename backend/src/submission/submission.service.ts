import path from 'path';
import fs from 'fs';
import { promises as fsp } from 'fs';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import { FastifyInstance } from 'fastify';
import { randomToken } from '../utils/crypto';
import { submissionRepository } from './submission.repository';
import { fileQueue } from '../modules/processing/queue';
import { logger } from '../utils/logger';
import { getPaginationParams, buildPaginatedResult, PaginationOptions } from '../utils/pagination';

const UPLOAD_DIR = path.resolve(process.cwd(), 'upload', 'submissions');
const ALLOWED_MIMETYPES = ['application/pdf'];
const ALLOWED_EXTENSIONS = ['.pdf'];

export const submissionService = (app: FastifyInstance) => {
  const repo = submissionRepository(app);

  const addSubmission = async (
    file: any,
    meta: { semester: string; university: string; userId: string }
  ) => {
    await fsp.mkdir(UPLOAD_DIR, { recursive: true });

    const fileMimeType = file.mimetype || '';
    const fileExt = path.extname(file.filename || '').toLowerCase();

    if (!ALLOWED_MIMETYPES.includes(fileMimeType) && !ALLOWED_EXTENSIONS.includes(fileExt)) {
      throw new Error('Only PDF files are allowed');
    }

    const storedName = `${randomToken(12)}.pdf`;
    const filePath = path.join(UPLOAD_DIR, storedName);
    const fileStream = file?.file ?? (file?.buffer ? Readable.from(file.buffer) : null);

    try {
      if (!fileStream) {
        throw new Error('Invalid file stream');
      }
      await pipeline(fileStream, fs.createWriteStream(filePath));
      const stats = await fsp.stat(filePath);

      const record = await repo.addSubmission({
        originalName: file.filename,
        storedName,
        mimeType: fileMimeType || 'application/pdf',
        size: stats.size,
        path: filePath,
        semester: meta.semester,
        university: meta.university,
        status: 'UPLOADED',
        userId: meta.userId,
      });

      try {
        await fileQueue.add(
          'process-file',
          { fileId: record.id },
          {
            attempts: 3,
            backoff: { type: 'exponential', delay: 5000 },
            removeOnComplete: true,
            removeOnFail: false,
          }
        );
      } catch (queueErr) {
        logger.error('Failed to queue file for processing', queueErr);
      }

      return record;
    } catch (err) {
      logger.error('Submission upload failed', err);
      await fsp.unlink(filePath).catch(() => {});
      throw err;
    }
  };

  const listSubmission = async (options?: PaginationOptions) => {
    const { page, limit, skip } = getPaginationParams(options);
    const [submissions, total] = await Promise.all([
      repo.listSubmission(skip, limit),
      repo.countSubmission(),
    ]);
    return buildPaginatedResult(submissions, total, page, limit);
  };

  const deleteSubmission = async (id: string) => {
    const submission = await repo.detailSubmission(id);
    if (!submission) throw new Error('Submission not found');
    await fsp.unlink(submission.path).catch(() => {});
    await repo.deleteSubmission(id);
  };

  const detailSubmission = async (id: string) => {
    return repo.detailSubmission(id);
  };

  return {
    addSubmission,
    listSubmission,
    detailSubmission,
    deleteSubmission,
  };
};
