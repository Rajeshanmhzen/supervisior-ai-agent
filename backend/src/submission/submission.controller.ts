import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fs from 'fs';
import { submissionService } from './submission.service';
import { chatWithGemini } from '../modules/ai/gemini.service';
import { logger } from '../utils/logger';

export const submissionController = (app: FastifyInstance) => {
  const service = submissionService(app);

  const addSubmission = async (req: FastifyRequest, reply: FastifyReply) => {
    const parts = req.parts();
    let file: any = null;
    const fields: Record<string, string> = {};

    for await (const part of parts) {
      if (part.type === 'file') {
        const buffer = await part.toBuffer();
        file = {
          filename: part.filename,
          mimetype: part.mimetype,
          buffer,
        };
      } else {
        const rawValue =
          typeof part.value === 'function' ? await (part.value as () => Promise<any>)() : part.value;
        fields[part.fieldname] = typeof rawValue === 'string' ? rawValue : String(rawValue ?? '');
      }
    }

    if (!file) {
      return reply.code(400).send({ message: 'No file uploaded' });
    }

    const semester = fields.semester;
    const university = fields.university;
    const userId = req.user?.id || fields.userId;

    if (!semester || !university) {
      return reply.code(400).send({ message: 'semester and university are required' });
    }
    if (!userId) {
      return reply.code(400).send({ message: 'userId is required' });
    }

    const record = await service.addSubmission(file, { semester, university, userId });
    return reply.code(201).send({ message: 'Submission added', submission: record });
  };

  const listSubmission = async (req: FastifyRequest, reply: FastifyReply) => {
    const query = req.query as { page?: string; limit?: string };
    const page = query?.page ? Number.parseInt(query.page, 10) : undefined;
    const limit = query?.limit ? Number.parseInt(query.limit, 10) : undefined;
    const options: { page?: number; limit?: number } = {};
    if (Number.isFinite(page)) options.page = page as number;
    if (Number.isFinite(limit)) options.limit = limit as number;
    const data = await service.listSubmission(options);
    return reply.code(200).send(data);
  };

  const deleteSubmission = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as any;
    await service.deleteSubmission(id);
    return reply.code(200).send({ ok: true });
  };

  const detailSubmission = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as any;
    const submission = await service.detailSubmission(id);
    if (!submission) return reply.code(404).send({ message: 'Submission not found' });
    return reply.code(200).send({ message: 'Submission found', submission });
  };

  /**
   * Build a rich, contextual fallback response from the actual analysis data.
   * Unlike the old approach that returned one generic message, this examines
   * the real issues found and generates a detailed, specific reply.
   */
  const buildSmartFallback = (
    message: string,
    submission: any
  ): string => {
    const lowerMsg = message.toLowerCase();
    const analysis = submission.analysisResult as any;
    const ruleCheck = submission.ruleCheck as any;
    const semester = submission.semester || '4th';

    // Collect all real issues from analysis
    const allIssues: Array<{ category: string; severity: string; problem: string; fix: string }> = [];

    if (analysis?.formatting?.issues) {
      for (const issue of analysis.formatting.issues) {
        allIssues.push({ category: 'Formatting', severity: issue.severity, problem: issue.problem, fix: issue.fix });
      }
    }
    if (analysis?.references?.issues) {
      for (const issue of analysis.references.issues) {
        allIssues.push({ category: 'References', severity: issue.severity, problem: issue.problem, fix: issue.fix });
      }
    }
    if (analysis?.content?.feedback) {
      for (const fb of analysis.content.feedback) {
        allIssues.push({ category: 'Content', severity: fb.severity, problem: fb.problem, fix: fb.fix });
      }
    }
    if (ruleCheck?.issues) {
      for (const issue of ruleCheck.issues) {
        allIssues.push({ category: 'Structure', severity: issue.severity, problem: issue.message, fix: issue.fix || '' });
      }
    }

    // --- Specific topic handlers ---
    if (lowerMsg.includes('improve') || lowerMsg.includes('suggestion') || lowerMsg.includes('what should i') || lowerMsg.includes('what can i') || lowerMsg.includes('better') || lowerMsg.includes('fix')) {
      if (allIssues.length === 0) {
        return `Great news! Your ${semester} semester report looks good — no major issues were found in the automated review. Here are some general tips to make it even stronger:\n\n• Double-check all figure and table captions are numbered sequentially\n• Ensure your references follow IEEE format consistently\n• Have a peer review the report for grammar and clarity\n• Verify page numbering is correct throughout`;
      }

      const critical = allIssues.filter(i => i.severity === 'CRITICAL');
      const major = allIssues.filter(i => i.severity === 'MAJOR');
      const minor = allIssues.filter(i => i.severity === 'MINOR');

      let response = `Based on the review of your ${semester} semester report, here are the improvements needed:\n\n`;

      if (critical.length > 0) {
        response += `🔴 **Critical Issues (fix immediately):**\n`;
        for (const issue of critical) {
          response += `• [${issue.category}] ${issue.problem}${issue.fix ? ` → ${issue.fix}` : ''}\n`;
        }
        response += '\n';
      }

      if (major.length > 0) {
        response += `🟡 **Major Issues:**\n`;
        for (const issue of major) {
          response += `• [${issue.category}] ${issue.problem}${issue.fix ? ` → ${issue.fix}` : ''}\n`;
        }
        response += '\n';
      }

      if (minor.length > 0) {
        response += `🔵 **Minor Issues:**\n`;
        for (const issue of minor.slice(0, 5)) {
          response += `• [${issue.category}] ${issue.problem}${issue.fix ? ` → ${issue.fix}` : ''}\n`;
        }
        if (minor.length > 5) response += `• ...and ${minor.length - 5} more minor issues\n`;
        response += '\n';
      }

      response += `\nTotal score: ${analysis?.total ?? 'N/A'}/100. Focus on fixing the critical issues first!`;
      return response;
    }

    if (lowerMsg.includes('score') || lowerMsg.includes('grade') || lowerMsg.includes('how did') || lowerMsg.includes('how is') || lowerMsg.includes('good')) {
      const total = analysis?.total ?? 'N/A';
      const fmtScore = analysis?.formatting?.normalizedScore ?? 'N/A';
      const structScore = analysis?.structure?.normalizedScore ?? 'N/A';
      const contentScore = analysis?.content?.normalizedScore ?? 'N/A';

      let verdict = '';
      if (typeof total === 'number') {
        if (total >= 80) verdict = 'Excellent work! Your report meets most guidelines well.';
        else if (total >= 60) verdict = 'Good effort, but there are areas that need improvement.';
        else if (total >= 40) verdict = 'Your report needs significant improvements to meet TU standards.';
        else verdict = 'Your report has critical issues that must be addressed before submission.';
      }

      return `Here is your ${semester} semester report score breakdown:\n\n📊 **Total Score: ${total}/100**\n• Formatting: ${fmtScore}/30\n• Structure & Guidelines: ${structScore}/30\n• Content Quality: ${contentScore}/40\n\n${verdict}\n\nWould you like me to list the specific improvements needed?`;
    }

    if (lowerMsg.includes('erd') || lowerMsg.includes('er diagram') || lowerMsg.includes('diagram') || lowerMsg.includes('dfd') || lowerMsg.includes('use case')) {
      return `For system design diagrams in your ${semester} semester report:\n\n• **ER Diagrams & DFDs** belong in Chapter 3 (System Analysis & Design) for a final report, or the Methodology section for a proposal\n• Every diagram must be clearly captioned (e.g., "Figure 3.1: ER Diagram of the System")\n• Place captions *below* the figure\n• Reference each diagram in the text (e.g., "As shown in Figure 3.1...")\n• Use case diagrams should follow UML notation\n\nMake sure all diagrams are high-resolution and readable when printed.`;
    }

    if (lowerMsg.includes('font') || lowerMsg.includes('times new roman') || lowerMsg.includes('style') || lowerMsg.includes('size') || lowerMsg.includes('format')) {
      return `Tribhuvan University formatting requirements for your ${semester} semester report:\n\n• **Font**: Times New Roman\n• **Body text**: Size 12, 1.5 line spacing\n• **Chapter titles**: Size 14, Bold, ALL CAPS\n• **Section headings**: Size 12, Bold\n• **Margins**: Top/Bottom: 1 inch, Left: 1.5 inches, Right: 1 inch\n• **Page numbering**: Roman numerals (i, ii, iii) for preliminary pages, Arabic (1, 2, 3) from Chapter 1\n• **Paper size**: A4\n\nDouble-check your entire document for consistency. One common mistake is mixing fonts after copy-pasting from different sources.`;
    }

    if (lowerMsg.includes('abstract') || lowerMsg.includes('executive summary')) {
      return `Your Abstract should follow this structure:\n\n1. **Problem context** (1-2 sentences)\n2. **Project objectives** (1-2 sentences)\n3. **Methodology used** (1-2 sentences)\n4. **Key results/findings** (1-2 sentences)\n\n**Requirements:**\n• Word count: 150-300 words\n• Write in past tense for completed work\n• No citations or references in the abstract\n• Abstracts are only required for the Final Report, NOT the Proposal Defense\n\n${allIssues.some(i => i.problem.toLowerCase().includes('abstract')) ? '⚠️ Note: Our review found an issue with your abstract section. Please check the findings tab for details.' : ''}`;
    }

    if (lowerMsg.includes('reference') || lowerMsg.includes('citation') || lowerMsg.includes('ieee') || lowerMsg.includes('apa')) {
      return `References must follow IEEE format for TU BCA reports:\n\n**Format:** [Number] Author(s), "Title," Publication, vol., no., pp., Year.\n\n**Example:**\n[1] A. Smith and B. Jones, "Machine Learning in Web Development," IEEE Trans. Software Eng., vol. 45, no. 3, pp. 234-248, 2023.\n\n**Rules:**\n• Number references in order of citation: [1], [2], [3]\n• Every reference must be cited in the text\n• Include DOI or URL when available\n• Minimum 8-10 references recommended\n• Include recent publications (within last 5 years)\n\n${allIssues.some(i => i.category === 'References') ? '⚠️ Our review found reference issues in your report. Check the findings tab for specifics.' : ''}`;
    }

    if (lowerMsg.includes('proposal') || lowerMsg.includes('defence') || lowerMsg.includes('defense')) {
      return `For a Proposal Defense (${semester} semester), your document should include:\n\n1. ✅ Cover Page\n2. ✅ Introduction\n3. ✅ Problem Statement\n4. ✅ Objectives\n5. ✅ Methodology\n6. ✅ Gantt Chart / Project Schedule\n7. ✅ Expected Outcome\n8. ✅ References\n\n**NOT needed for proposals:**\n❌ Implementation & Testing\n❌ Results & Discussion\n❌ Conclusion\n❌ User Manual\n\nKeep the proposal concise — typically 15-25 pages.`;
    }

    if (lowerMsg.includes('chapter') || lowerMsg.includes('structure') || lowerMsg.includes('section') || lowerMsg.includes('outline')) {
      return `Standard TU BCA ${semester} Semester Final Report Structure:\n\n**Preliminary Pages:**\n• Cover Page → Certificate → Acknowledgement → Abstract → Table of Contents → List of Figures → List of Tables → List of Abbreviations\n\n**Main Chapters:**\n• Chapter 1: Introduction (Problem Statement, Objectives, Scope)\n• Chapter 2: Literature Review / Background Study\n• Chapter 3: System Analysis & Design (ER Diagram, DFD, Use Cases)\n• Chapter 4: Implementation & Testing\n• Chapter 5: Conclusion & Future Enhancements\n\n**End Matter:**\n• References → Appendices\n\n${ruleCheck?.issues?.length > 0 ? `⚠️ Your report is missing ${ruleCheck.issues.filter((i: any) => i.severity === 'CRITICAL').length} required sections. Check the findings tab.` : '✅ Your report structure looks complete!'}`;
    }

    // Default — but now with actual context
    if (allIssues.length > 0) {
      const topIssues = allIssues.slice(0, 3);
      let response = `As your supervisor, here's what I noticed about your ${semester} semester report "${submission.originalName}":\n\n`;
      response += `📊 Overall Score: ${analysis?.total ?? 'N/A'}/100\n\n`;
      response += `Top issues to address:\n`;
      for (const issue of topIssues) {
        response += `• [${issue.category}] ${issue.problem}\n`;
      }
      if (allIssues.length > 3) {
        response += `\n...and ${allIssues.length - 3} more issues. Ask me "What improvements should I make?" for the full list.\n`;
      }
      response += `\nFeel free to ask about any specific topic — formatting, structure, references, or your project content!`;
      return response;
    }

    return `Your ${semester} semester report "${submission.originalName}" has been reviewed. Your overall score is ${analysis?.total ?? 'N/A'}/100.\n\nYou can ask me about:\n• "What improvements should I make?"\n• "How is my score?"\n• "Check my references"\n• "Is my structure correct?"\n• Any question about your project topic\n\nI'm here to help you produce the best possible report!`;
  };

  const chatWithSupervisor = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const { message } = req.body as { message: string };

    if (!message?.trim()) {
      return reply.code(400).send({ message: 'Message is required' });
    }

    const submission = await service.detailSubmission(id);
    if (!submission) return reply.code(404).send({ message: 'Submission not found' });

    // Extract document text excerpt for context
    let docTextExcerpt = '';
    try {
      const { extractPdfText } = require('../modules/file/file.service');
      const fullText = await extractPdfText(submission.path);
      docTextExcerpt = fullText.slice(0, 2500);
    } catch {
      docTextExcerpt = '';
    }

    // === Strategy 1: Try Gemini AI (primary — always available via API) ===
    try {
      const geminiResponse = await chatWithGemini(message, {
        documentName: submission.originalName,
        semester: submission.semester,
        university: submission.university,
        analysisResult: submission.analysisResult,
        ruleCheck: submission.ruleCheck,
        docTextExcerpt,
      });

      if (geminiResponse) {
        return reply.code(200).send({ response: geminiResponse });
      }
    } catch (geminiErr: any) {
      logger.info('Gemini chat failed, trying Ollama fallback', geminiErr?.message);
    }

    // === Strategy 2: Try Ollama (local LLM) ===
    try {
      const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
      const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'phi3:mini';

      const chatPrompt = `You are an expert BCA project supervisor for ${submission.university} checking a ${submission.semester} semester project report.
The document: "${submission.originalName}"
Analysis results: ${JSON.stringify(submission.analysisResult ?? {})}
Rule check: ${JSON.stringify(submission.ruleCheck ?? {})}
${docTextExcerpt ? `Document excerpt: """${docTextExcerpt.slice(0, 1500)}"""` : ''}

Student asks: "${message}"

Give a concise, helpful, and academically supportive response. Be specific about their report. Use bullet points for lists.`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30_000);

      try {
        const res = await fetch(`${OLLAMA_URL}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            model: OLLAMA_MODEL,
            prompt: chatPrompt,
            stream: false,
          }),
        });

        if (!res.ok) throw new Error('Ollama error');

        const data = (await res.json()) as { response?: string };
        if (data?.response?.trim()) {
          return reply.code(200).send({ response: data.response.trim() });
        }
      } finally {
        clearTimeout(timeout);
      }
    } catch (ollamaErr: any) {
      logger.info('Ollama chat also failed, using smart fallback', ollamaErr?.message);
    }

    // === Strategy 3: Smart rule-based fallback (always works) ===
    const response = buildSmartFallback(message, submission);
    return reply.code(200).send({ response });
  };

  const serveFile = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as any;
    const submission = await service.detailSubmission(id);
    if (!submission) return reply.code(404).send({ message: 'Submission not found' });
    if (!fs.existsSync(submission.path)) return reply.code(404).send({ message: 'File not found on disk' });
    const stream = fs.createReadStream(submission.path);
    reply.header('Content-Type', submission.mimeType);
    reply.header('Content-Disposition', `inline; filename="${submission.originalName}"`);
    return reply.send(stream);
  };
  const recheckSubmission = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as any;
    const submission = await service.detailSubmission(id);
    if (!submission) return reply.code(404).send({ message: 'Submission not found' });
    
    const { processFile } = require('../modules/processing/processor');
    processFile({ fileId: id }).catch((e: any) => logger.error('Recheck failed', e));
    
    return reply.code(200).send({ message: 'Recheck started' });
  };

  return {
    addSubmission,
    listSubmission,
    detailSubmission,
    deleteSubmission,
    serveFile,
    chatWithSupervisor,
    recheckSubmission,
  };
};
