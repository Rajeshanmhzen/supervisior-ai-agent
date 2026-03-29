import { PrismaClient } from '@prisma/client';
import { extractPdfText } from '../file/file.service';
import { analyzeWithAI } from '../ai/ai.service';
import { logger } from '../../utils/logger';

const prisma = new PrismaClient();

const withTimeout = async <T>(promise: Promise<T>, ms: number, label: string) => {
  let timeoutId: NodeJS.Timeout;
  const timeout = new Promise<T>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`${label} timed out`)), ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timeoutId!);
  }
};

export const processFile = async ({ fileId }: { fileId: string }) => {
  try {
    await prisma.fileUpload.update({
      where: { id: fileId },
      data: { status: 'PROCESSING', errorMessage: null, progress: 10 },
    });

    const file = await prisma.fileUpload.findUnique({ where: { id: fileId } });
    if (!file) throw new Error('File not found');

    const text = await withTimeout(extractPdfText(file.path), 60_000, 'PDF extraction');
    await prisma.fileUpload.update({
      where: { id: fileId },
      data: { progress: 50 },
    });

    const result = await withTimeout(analyzeWithAI(text), 120_000, 'AI analysis');
    await prisma.fileUpload.update({
      where: { id: fileId },
      data: { progress: 90 },
    });

    await prisma.fileUpload.update({
      where: { id: fileId },
      data: {
        status: 'COMPLETED',
        analysisResult: result,
        progress: 100,
      },
    });
  } catch (err: any) {
    logger.error('Processing failed', err);
    await prisma.fileUpload.update({
      where: { id: fileId },
      data: {
        status: 'FAILED',
        errorMessage: err?.message || 'Processing failed',
        progress: 0,
      },
    });
  }
};
