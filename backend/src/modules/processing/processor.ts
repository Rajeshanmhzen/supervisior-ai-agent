import { Prisma, PrismaClient } from '@prisma/client';
import { extractPdfPages, extractPdfText } from '../file/file.service';
import { analyzeWithAI } from '../ai/ai.service';
import { getGuidelineRules, getGuidelineText } from '../guidelines/guidelines.service';
import { runRuleChecks } from '../guidelines/rules.engine';
import { runFormattingRules } from '../rules/formatting';
import { runReferenceRules } from '../rules/reference';
import { retrieveGuidelineContext } from '../rag/rag.service';
import { emitSubmissionUpdate } from '../realtime/submission.socket';
import { logger } from '../../utils/logger';

const prisma = new PrismaClient();

const sanitizeString = (value: string) =>
  value.replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, '�');

const sanitizeJson = (value: any): any => {
  if (typeof value === 'string') return sanitizeString(value);
  if (Array.isArray(value)) return value.map(sanitizeJson);
  if (value && typeof value === 'object') {
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(value)) out[k] = sanitizeJson(v);
    return out;
  }
  return value;
};

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
  let userId: string | null = null;
  try {
    await prisma.fileUpload.update({
      where: { id: fileId },
      data: { status: 'PROCESSING', errorMessage: null, progress: 10 },
    });

    const file = await prisma.fileUpload.findUnique({ where: { id: fileId } });
    if (!file) throw new Error('File not found');
    userId = file.userId || null;
    if (userId) {
      emitSubmissionUpdate(userId, { fileId, status: 'PROCESSING', progress: 10 });
    }

    let text = '';
    let pages: string[] = [];
    try {
      text = await withTimeout(extractPdfText(file.path), 60_000, 'PDF extraction');
      pages = await withTimeout(extractPdfPages(file.path), 60_000, 'PDF page extraction');
    } catch (extractErr: any) {
      logger.error('PDF extraction failed', extractErr);
      await prisma.fileUpload.update({
        where: { id: fileId },
        data: {
          status: 'FAILED',
          errorMessage: 'Failed to extract text from PDF. The file may be corrupted or not a valid PDF.',
        } as any,
      });
      return;
    }

    await prisma.fileUpload.update({
      where: { id: fileId },
      data: { progress: 50 } as any,
    });
    if (userId) {
      emitSubmissionUpdate(userId, { fileId, status: 'PROCESSING', progress: 50 });
    }

    const rules = getGuidelineRules({
      university: file.university || '',
      semester: file.semester || '',
    });
    const ruleCheck = rules ? runRuleChecks(text, rules) : null;
    const rulesSummary = rules
      ? `Required sections: ${(rules.requiredSections || []).join(', ') || 'None'}; ` +
        `Abstract words: ${rules.abstract?.minWords ?? 'N/A'}-${rules.abstract?.maxWords ?? 'N/A'}; ` +
        `References patterns: ${(rules.references?.patterns || []).join(', ') || 'None'}`
      : null;

    const fastMode = (process.env.FAST_MODE || '').toLowerCase() === 'true';
    const maxChunks = fastMode ? 0 : 6;
    const chunks: { range: string; text: string }[] = [];
    if (pages.length > 0) {
      let current: string[] = [];
      let currentStart = 1;
      let currentChars = 0;
      const maxChars = 3000;

      for (let i = 0; i < pages.length; i += 1) {
        const pageText = pages[i] || '';
        const nextChars = currentChars + pageText.length;
        if (nextChars > maxChars && current.length > 0) {
          const endPage = i;
          chunks.push({
            range: `Pages ${currentStart}-${endPage}`,
            text: current.join('\n'),
          });
          current = [];
          currentChars = 0;
          currentStart = i + 1;
        }
        current.push(pageText);
        currentChars += pageText.length;
        if (chunks.length >= maxChunks) break;
      }
      if (current.length > 0 && chunks.length < maxChunks) {
        chunks.push({
          range: `Pages ${currentStart}-${Math.min(pages.length, currentStart + current.length - 1)}`,
          text: current.join('\n'),
        });
      }
    }

    const formattingResult = runFormattingRules(text);
    const referenceResult = runReferenceRules(text);

    const aiFeedback: any[] = [];
    if (!fastMode) {
      let ragContext: string | null = null;
      try {
        const guidelineText = await getGuidelineText({
          university: file.university || '',
          semester: file.semester || '',
        });
        if (guidelineText) {
          ragContext = await retrieveGuidelineContext(
            'key formatting, references, and required sections for the project',
            guidelineText
          );
        }
      } catch (ragErr: any) {
        logger.info('RAG context build failed, continuing without it', ragErr?.message || ragErr);
      }

      if (chunks.length > 0) {
        for (const chunk of chunks) {
          const feedback = await withTimeout(
            analyzeWithAI(chunk.text, rulesSummary, chunk.range, ragContext),
            300_000,
            'AI analysis'
          );
          aiFeedback.push({ pageRange: chunk.range, ...feedback });
        }
      } else {
        const feedback = await withTimeout(
          analyzeWithAI(text, rulesSummary, 'Full document', ragContext),
          300_000,
          'AI analysis'
        );
        aiFeedback.push({ pageRange: 'Full document', ...feedback });
      }
    } else {
      aiFeedback.push({
        pageRange: 'Skipped (FAST_MODE)',
        summary: 'AI analysis skipped to speed up processing.',
        issues: [],
        suggestions: [],
      });
    }
    const contentScores = aiFeedback
      .map((entry) => Number(entry?.content?.score ?? 0))
      .filter((score) => Number.isFinite(score));
    const contentScore =
      contentScores.length > 0
        ? Math.round(contentScores.reduce((sum, score) => sum + score, 0) / contentScores.length)
        : 0;
    const contentFeedback = aiFeedback.flatMap((entry) => entry?.content?.feedback || []);

    const structuredResult = {
      formatting: formattingResult,
      references: referenceResult,
      content: {
        score: contentScore,
        feedback: contentFeedback,
      },
      total: formattingResult.score + referenceResult.score + contentScore,
      aiFeedback,
    };

    const safeResult = sanitizeJson(structuredResult);
    const safeJson = JSON.parse(JSON.stringify(safeResult));
    await prisma.fileUpload.update({
      where: { id: fileId },
      data: { progress: 90 },
    });
    if (userId) {
      emitSubmissionUpdate(userId, { fileId, status: 'PROCESSING', progress: 90 });
    }

    await prisma.fileUpload.update({
      where: { id: fileId },
      data: {
        status: 'COMPLETED',
        analysisResult: safeJson,
        ruleCheck: ruleCheck ?? Prisma.JsonNull,
        progress: 100,
      },
    });
    if (userId) {
      emitSubmissionUpdate(userId, { fileId, status: 'COMPLETED', progress: 100 });
    }
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
    if (userId) {
      emitSubmissionUpdate(userId, {
        fileId,
        status: 'FAILED',
        progress: 0,
        errorMessage: err?.message || 'Processing failed',
      });
    }
  }
};
