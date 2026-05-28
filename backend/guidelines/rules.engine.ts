import { MergedRules, RuleCheckResult, RuleIssue } from '../src/types/rules.types';

const normalize = (text: string): string => text.toLowerCase().trim();

const sectionSynonyms: Record<string, string[]> = {
  "cover page": ["cover page", "tribhuvan university", "faculty of humanities", "submitted to", "project on", "bca project report", "department of computer application"],
  "certificate": ["certificate", "certificate of approval", "recommendation", "this is to certify", "acceptance letter", "letter of approval", "evaluation committee"],
  "acknowledgement": ["acknowledgement", "acknowledgements", "acknowledgment", "acknowledgments"],
  "abstract": ["abstract", "abstracts", "executive summary"],
  "table of contents": ["table of contents", "contents", "table of content"],
  "list of abbreviations": ["list of abbreviations", "abbreviations", "list of acronyms", "acronyms", "abbreviation"],
  "list of figures": ["list of figures", "figures list", "list of figure"],
  "list of tables": ["list of tables", "tables list", "list of table"],
  "introduction": ["introduction"],
  "problem statement": ["problem statement", "statement of the problem", "problem statement & justification", "problem statement and justification"],
  "objectives": ["objectives", "objective", "project objectives", "project objective"],
  "methodology": ["methodology", "methodologies", "system methodology", "project methodology"],
  "gantt chart": ["gantt chart", "gannt chart", "gantt", "gannt", "project schedule", "timeline"],
  "expected outcome": ["expected outcome", "expected outcomes", "expected output", "expected outputs"],
  "references": ["references", "reference", "bibliography", "literature cited"]
};

/**
 * Find if a section exists in the document (robustly ignores Table of Contents matches)
 */
export const findSectionIndex = (text: string, sectionName: string): number => {
  const key = sectionName.toLowerCase().trim();
  const synonyms = sectionSynonyms[key] || [sectionName];

  // Detect TOC range to prevent false matches inside Table of Contents
  const lowerText = text.toLowerCase();
  let tocStart = lowerText.indexOf('table of contents');
  if (tocStart === -1) tocStart = lowerText.indexOf('\ncontents');
  if (tocStart === -1) tocStart = lowerText.indexOf('contents\n');

  let tocEnd = -1;
  if (tocStart !== -1) {
    const afterTOC = lowerText.slice(tocStart + 10);
    let endRelative = afterTOC.indexOf('chapter 1');
    if (endRelative === -1) endRelative = afterTOC.indexOf('chapter i');
    if (endRelative === -1) endRelative = afterTOC.indexOf('1. introduction');
    if (endRelative === -1) endRelative = afterTOC.indexOf('introduction');

    if (endRelative !== -1) {
      tocEnd = tocStart + 10 + endRelative;
    } else {
      tocEnd = tocStart + Math.round(text.length * 0.25);
    }
  }

  let searchStart = 0;
  searchLoop: while (searchStart < text.length) {
    const slice = text.slice(searchStart);
    let bestMatch: { index: number; length: number; line: string } | null = null;

    for (const syn of synonyms) {
      const patterns = [
        new RegExp(`(?:^|\\n)\\s*\\d+(?:\\.\\d+)*\\.?\\s+(${syn})\\b`, 'i'),
        new RegExp(`(?:^|\\n)\\s*(${syn})\\b`, 'i'),
        new RegExp(`(?:^|\\n)\\s*chapter\\s+\\d+[:.]?\\s*(${syn})\\b`, 'i')
      ];

      for (const pattern of patterns) {
        const match = pattern.exec(slice);
        if (match) {
          const absoluteIndex = searchStart + match.index;
          const lineStart = text.lastIndexOf('\n', absoluteIndex) + 1;
          let lineEnd = text.indexOf('\n', absoluteIndex);
          if (lineEnd === -1) lineEnd = text.length;
          const fullLine = text.slice(lineStart, lineEnd);

          if (!bestMatch || absoluteIndex < bestMatch.index) {
            bestMatch = { index: absoluteIndex, length: match[0].length, line: fullLine };
          }
        }
      }
    }

    if (!bestMatch) {
      // Fallback: If regex fails completely, do a simple text search
      for (const syn of synonyms) {
        const simpleIndex = slice.toLowerCase().indexOf(syn);
        if (simpleIndex !== -1) {
          const absoluteIndex = searchStart + simpleIndex;
          
          // Verify it's not inside TOC
          const isInsideTOC = tocStart !== -1 && tocEnd !== -1 && absoluteIndex >= tocStart && absoluteIndex < tocEnd;
          
          if (!isInsideTOC) {
            return absoluteIndex;
          }
        }
      }
      break;
    }

    // Check if match falls within the Table of Contents range
    const isInsideTOC = tocStart !== -1 && tocEnd !== -1 && bestMatch.index >= tocStart && bestMatch.index < tocEnd;

    // References section must be in the latter part of the document
    const isReferences = sectionName.toLowerCase() === 'references';
    if (isReferences && bestMatch.index < text.length * 0.6) {
      searchStart = bestMatch.index + Math.max(1, bestMatch.length);
      continue searchLoop;
    }

    const lineLower = bestMatch.line.toLowerCase();
    const isTOCLine = lineLower.includes('...') ||
                      (lineLower.match(/\./g) || []).length > 3 ||
                      /\.\s*\d+\s*$/.test(lineLower) ||
                      /\bpage\b\s*\d+/i.test(lineLower) ||
                      (sectionName.toLowerCase() !== 'cover page' && lineLower.includes('table of contents'));

    const isPreliminary = ['list of figures', 'list of tables', 'list of abbreviations', 'acknowledgement', 'abstract'].includes(sectionName.toLowerCase());

    if ((!isInsideTOC || isPreliminary) && !isTOCLine) {
      return bestMatch.index;
    }

    searchStart = bestMatch.index + Math.max(1, bestMatch.length);
  }
  return -1;
};

/**
 * Count approximate words in a section
 */
const wordCount = (text: string): number => {
  return text
    .replace(/[^A-Za-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
};

/**
 * Main Rule Engine
 */
export const runRuleChecks = (
  text: string, 
  rules: MergedRules,
  options?: { usesTimesNewRoman?: boolean }
): RuleCheckResult => {
  const issues: RuleIssue[] = [];
  const lowerText = normalize(text);

  // Auto-detect if it is a project proposal defense
  const hasGantt = lowerText.includes('gantt chart') || lowerText.includes('gannt chart') || lowerText.includes('gantt');
  const hasExpectedOutcome = lowerText.includes('expected outcome') || lowerText.includes('expected outcomes');
  const hasImplementation = lowerText.includes('chapter 4') || lowerText.includes('implementation and testing') || lowerText.includes('implementation & testing') || lowerText.includes('testing and implementation');

  const isProposal = lowerText.includes('project proposal') || 
                     lowerText.includes('proposal defense') || 
                     lowerText.includes('proposal defence') || 
                     lowerText.includes('internship proposal') ||
                     lowerText.includes('defense proposal') ||
                     lowerText.includes('proposal for') ||
                     (hasGantt && hasExpectedOutcome && !hasImplementation);

  if (isProposal) {
    // === Proposal Checks ===
    const sectionsToCheck = rules.proposalSections || [
      "Introduction", 
      "Problem Statement", 
      "Objectives", 
      "Methodology", 
      "Gantt Chart", 
      "Expected Outcome", 
      "References"
    ];

    for (const section of sectionsToCheck) {
      const index = findSectionIndex(text, section);
      if (index === -1) {
        issues.push({
          severity: 'CRITICAL',
          rule: `proposal:${section}`,
          message: `Missing required proposal section: "${section}"`,
          fix: `Add "${section}" section to your project proposal.`
        });
      }
    }
  } else {
    // === Final Report Checks ===
    // 1. Required Sections Check
    if (rules.requiredSections && rules.requiredSections.length > 0) {
      for (const section of rules.requiredSections) {
        const index = findSectionIndex(text, section);
        if (index === -1) {
          issues.push({
            severity: 'CRITICAL',
            rule: `section:${section}`,
            message: `Missing required section: "${section}"`,
            fix: `Add "${section}" section as per TU guideline.`
          });
        }
      }
    }

    // 2. Required Chapters Check
    if (rules.requiredChapters && rules.requiredChapters.length > 0) {
      for (const chapter of rules.requiredChapters) {
        const index = findSectionIndex(text, `Chapter ${chapter}`);
        if (index === -1) {
          issues.push({
            severity: 'CRITICAL',
            rule: `chapter:${chapter}`,
            message: `Missing Chapter ${chapter}`,
            fix: `Add Chapter ${chapter} as per guideline structure.`
          });
        }
      }
    }

    // 3. Abstract Quality Check
    if (rules.chapterDetails?.['1']?.includes('Abstract') || rules.requiredSections?.includes('Abstract')) {
      const abstractText = extractSection(text, 'Abstract', ['Acknowledgement', 'Table of Contents']);
      if (abstractText) {
        const words = wordCount(abstractText);
        if (words < 150) {
          issues.push({
            severity: 'MAJOR',
            rule: 'abstract:length',
            message: `Abstract is too short (${words} words). Minimum recommended is 150 words.`,
            fix: 'Expand the abstract to include objectives, methodology, and key findings.'
          });
        }
      } else {
        issues.push({
          severity: 'CRITICAL',
          rule: 'abstract:missing',
          message: 'Abstract section is missing or too weak.',
          fix: 'Add a proper Abstract section (150-300 words).'
        });
      }
    }
  }

  // === 4. References Check ===
  if (rules.referencing?.required) {
    const refsIndex = findSectionIndex(text, 'References');
    if (refsIndex === -1) {
      issues.push({
        severity: 'CRITICAL',
        rule: 'references:missing',
        message: 'References section is missing.',
        fix: 'Add References section in IEEE format.'
      });
    }
  }

  // === 5. Formatting Warnings (Basic) ===
  const hasTimesNewRoman = lowerText.includes('times new roman') || options?.usesTimesNewRoman === true;
  if (!hasTimesNewRoman) {
    issues.push({
      severity: 'MINOR',
      rule: 'formatting:font',
      message: 'Document may not be using Times New Roman font.',
      fix: 'Set font to Times New Roman, size 12 for body text.'
    });
  }

  // Calculate score
  const criticalCount = issues.filter(i => i.severity === 'CRITICAL').length;
  const majorCount = issues.filter(i => i.severity === 'MAJOR').length;
  const score = Math.max(0, 100 - (criticalCount * 25) - (majorCount * 10));

  return {
    passed: issues.length === 0,
    issues,
    summary: issues.length === 0 
      ? `All ${isProposal ? 'proposal' : 'final report'} checks passed successfully.` 
      : `${issues.length} issue(s) found (${criticalCount} critical).`,
    score,
    isProposal
  };
};

/**
 * Helper: Extract text of a specific section
 */
function extractSection(text: string, sectionName: string, stopAt: string[] = []): string {
  const start = findSectionIndex(text, sectionName);
  if (start === -1) return '';

  const afterStart = text.slice(start);
  let end = afterStart.length;

  for (const stopSection of stopAt) {
    const stopIndex = findSectionIndex(afterStart, stopSection);
    if (stopIndex !== -1 && stopIndex < end) {
      end = stopIndex;
    }
  }

  return afterStart.slice(0, end).trim();
}