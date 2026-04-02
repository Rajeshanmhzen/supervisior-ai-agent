import path from 'path';
import fs from 'fs';
import { promises as fsp } from 'fs';
import { pipeline } from 'stream/promises';
import { FastifyInstance } from 'fastify';
import { randomToken } from '../../utils/crypto';
import { uploadRepository } from './upload.repository';
import { fileQueue } from '../processing/queue';
import { logger } from '../../utils/logger';

const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');
const ALLOWED_TYPES = ['application/pdf'];

export const uploadService = (app: FastifyInstance) => {
  const repo = uploadRepository(app);

  const saveUpload = async (
    file: any,
    meta: { semester: string; university: string; userId: string }
  ) => {
    await fsp.mkdir(UPLOAD_DIR, { recursive: true });

    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      throw new Error('Only PDF files are allowed');
    }

    const ext = path.extname(file.filename || '');
    const storedName = `${randomToken(12)}${ext}`;
    const filePath = path.join(UPLOAD_DIR, storedName);

    try {
      // stream to disk (no memory spike)
      await pipeline(file.file, fs.createWriteStream(filePath));
      const stats = await fsp.stat(filePath);

      const record = await repo.createFile({
        originalName: file.filename,
        storedName,
        mimeType: file.mimetype,
        size: stats.size,
        path: filePath,
        semester: meta.semester,
        university: meta.university,
        status: 'UPLOADED',
        userId: meta.userId,
      });

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

      return record;
    } catch (err) {
      logger.error('Upload failed', err);
      await fsp.unlink(filePath).catch(() => {});
      throw err;
    }
  };

  const listUploads = async (options?: { page?: number; limit?: number }) => {
    const page = Math.max(1, options?.page ?? 1);
    const limit = Math.max(1, options?.limit ?? 5);
    const skip = (page - 1) * limit;

    const [files, total] = await Promise.all([
      repo.getFilesPaged(skip, limit),
      repo.countFiles(),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      files,
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  };

  const getUploadById = async (id: string) => {
    return repo.getFileById(id);
  };

  return {
    saveUpload,
    listUploads,
    getUploadById,
  };
};
