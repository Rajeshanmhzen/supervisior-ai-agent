import { Prisma, PrismaClient } from '@prisma/client';
import fs from 'fs';
import { extractPdfPages, extractPdfText, extractDocxText } from '../file/file.service';
import { analyzeWithAI } from '../ai/ai.service';
import { getGuidelineText } from '../guidelines/guidelines.service';
import { getRulesForSemester } from '../../../guidelines/ruleLoader';
import { runRuleChecks } from '../../../guidelines/rules.engine';
import { runFormattingRules } from '../rules/formatting';
import { runReferenceRules } from '../rules/reference';
import { retrieveGuidelineContext } from '../rag/rag.service';
import { emitSubmissionUpdate, emitReviewComplete } from '../realtime/submission.socket';
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

const detectSemesterAndUniversity = (text: string): { semester: string | null; university: string | null } => {
  const lowerText = text.toLowerCase();
  
  let semester: string | null = null;
  
  const has8th = lowerText.includes('eighth semester') || 
                 lowerText.includes('8th semester') || 
                 lowerText.includes('8th sem') || 
                 lowerText.includes('internship') || 
                 /\bproject\s+iii\b/i.test(text);
                 
  const has6th = lowerText.includes('sixth semester') || 
                 lowerText.includes('6th semester') || 
                 lowerText.includes('6th sem') || 
                 /\bproject\s+ii\b/i.test(text);
                 
  const has4th = lowerText.includes('fourth semester') || 
                 lowerText.includes('4th semester') || 
                 lowerText.includes('4th sem') || 
                 /\bproject\s+i\b/i.test(text);

  if (has8th) {
    semester = '8th';
  } else if (has6th) {
    semester = '6th';
  } else if (has4th) {
    semester = '4th';
  }

  let university: string | null = null;
  if (lowerText.includes('tribhuvan university') || lowerText.includes('t.u.') || lowerText.includes('tu ')) {
    university = 'Tribhuvan University';
  } else if (lowerText.includes('kathmandu university') || lowerText.includes('k.u.') || lowerText.includes('ku ')) {
    university = 'Kathmandu University';
  } else if (lowerText.includes('pokhara university') || lowerText.includes('pu ')) {
    university = 'Pokhara University';
  } else if (lowerText.includes('purbanchal university') || lowerText.includes('p.u.')) {
    university = 'Purbanchal University';
  }

  return { semester, university };
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
      if (file.path.endsWith('.docx') || file.path.endsWith('.doc')) {
        text = await withTimeout(extractDocxText(file.path), 60_000, 'DOCX extraction');
        // split text into ~3000 character chunks to simulate pages
        pages = text.match(/[\s\S]{1,3000}/g) || [];
      } else {
        text = await withTimeout(extractPdfText(file.path), 60_000, 'PDF extraction');
        pages = await withTimeout(extractPdfPages(file.path), 60_000, 'PDF page extraction');
      }
    } catch (extractErr: any) {
      logger.error('File text extraction failed', extractErr);
      await prisma.fileUpload.update({
        where: { id: fileId },
        data: {
          status: 'FAILED',
          errorMessage: 'Failed to extract text from file. The file may be corrupted or unsupported.',
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

    // Auto-detect semester and university from text
    const detected = detectSemesterAndUniversity(text);
    const resolvedSemester = detected.semester || file.semester || '4th';
    const resolvedUniversity = detected.university || file.university || 'Tribhuvan University';

    // If auto-detected semester/university is different, update in database
    if (resolvedSemester !== file.semester || resolvedUniversity !== file.university) {
      logger.info(`Auto-detected adjustments: semester=${resolvedSemester}, university=${resolvedUniversity} (original sem=${file.semester}, univ=${file.university})`);
      await prisma.fileUpload.update({
        where: { id: fileId },
        data: {
          semester: resolvedSemester,
          university: resolvedUniversity
        }
      });
    }

    // Load merged rules from the new guidelines system
    const fileBuffer = fs.readFileSync(file.path);
    const binaryStr = fileBuffer.toString('binary');
    const usesTimesNewRoman = binaryStr.includes('TimesNewRoman') || binaryStr.includes('Times-Roman') || binaryStr.includes('TimesNewRomanPS');

    const rules = getRulesForSemester(resolvedSemester);
    const ruleCheck = runRuleChecks(text, rules, { usesTimesNewRoman });
    
    const rulesSummary = rules
      ? `Required sections: ${(rules.requiredSections || []).join(', ') || 'None'}; ` +
        `Abstract words: 150-300; ` +
        `References patterns: doi, http, https`
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

    const formattingResult = runFormattingRules(text, ruleCheck.isProposal);
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
      const formattingPct = (formattingResult.score / 20) * 100;
      const structurePct = ruleCheck.score ?? 100;
      const simulatedScore = Math.round((formattingPct + structurePct) / 2);

      aiFeedback.push({
        pageRange: 'Skipped (FAST_MODE)',
        summary: 'AI analysis skipped to speed up processing.',
        content: {
          score: simulatedScore,
          feedback: [],
        },
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

    // Formatting Score (max 30) - normalized from raw formattingResult.score (max 20)
    const normalizedFormattingScore = Math.round((formattingResult.score / 20) * 30);
    
    // Structure Score (max 30) - normalized from rules engine ruleCheck.score (max 100)
    const normalizedStructureScore = Math.round(((ruleCheck.score ?? 100) / 100) * 30);
    
    // Content Score (max 40) - normalized from AI content score (max 100)
    const normalizedContentScore = Math.round((contentScore / 100) * 40);

    const totalScore = normalizedFormattingScore + normalizedStructureScore + normalizedContentScore;

    const structuredResult = {
      formatting: {
        ...formattingResult,
        normalizedScore: normalizedFormattingScore,
      },
      references: referenceResult,
      structure: {
        score: ruleCheck.score ?? 100,
        normalizedScore: normalizedStructureScore,
        passed: ruleCheck.passed,
        summary: ruleCheck.summary,
      },
      content: {
        score: contentScore,
        normalizedScore: normalizedContentScore,
        feedback: contentFeedback,
      },
      total: totalScore,
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

    const updatedFile = await prisma.fileUpload.update({
      where: { id: fileId },
      data: {
        status: 'COMPLETED',
        analysisResult: safeJson,
        ruleCheck: ruleCheck ? (JSON.parse(JSON.stringify(ruleCheck)) as any) : Prisma.JsonNull,
        progress: 100,
      },
    });
    if (userId) {
      emitSubmissionUpdate(userId, { fileId, status: 'COMPLETED', progress: 100 });

      // Count total issues across all categories
      const totalIssueCount =
        (safeResult.formatting?.issues?.length || 0) +
        (safeResult.references?.issues?.length || 0) +
        (safeResult.content?.feedback?.length || 0) +
        (ruleCheck?.issues?.length || 0);

      emitReviewComplete(userId, {
        fileId,
        status: 'COMPLETED',
        documentName: updatedFile.originalName,
        totalScore: totalScore,
        issueCount: totalIssueCount,
        formatting: normalizedFormattingScore,
        structure: normalizedStructureScore,
        content: normalizedContentScore,
      });
    }
  } catch (err: any) {
    logger.error('Processing failed', err);
    const failedFile = await prisma.fileUpload.update({
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
      emitReviewComplete(userId, {
        fileId,
        status: 'FAILED',
        documentName: failedFile.originalName,
        errorMessage: err?.message || 'Processing failed',
      });
    }
  }
};
