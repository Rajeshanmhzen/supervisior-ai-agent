import { RuleCheckResult, RuleIssue } from './rules.types';

const BASE_SCORE = 20;

const scorePenalty = (severity: RuleIssue['severity']) => {
  switch (severity) {
    case 'CRITICAL':
      return 10;
    case 'MAJOR':
      return 5;
    case 'MINOR':
    default:
      return 2;
  }
};

const hasLikelyHeading = (text: string, heading: string) =>
  new RegExp(`(^|\\n)\\s*${heading}\\s*(\\n|:)`, 'i').test(text);

const countOccurrences = (text: string, pattern: RegExp) => {
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
};

export const runFormattingRules = (text: string): RuleCheckResult => {
  const issues: RuleIssue[] = [];

  if (!hasLikelyHeading(text, 'Abstract')) {
    issues.push({
      category: 'formatting',
      severity: 'MAJOR',
      rule: 'formatting:heading:abstract',
      problem: 'Abstract heading missing.',
      reason: 'The document does not appear to include a clearly labeled Abstract section.',
      fix: 'Add a heading titled "Abstract" and place the abstract content beneath it.',
    });
  }

  if (!hasLikelyHeading(text, 'Introduction')) {
    issues.push({
      category: 'formatting',
      severity: 'MINOR',
      rule: 'formatting:heading:introduction',
      problem: 'Introduction heading missing.',
      reason: 'Projects are expected to start with a labeled Introduction section.',
      fix: 'Add an "Introduction" heading and organize the opening content under it.',
    });
  }

  const figureCaptions = countOccurrences(text, /\bFigure\s+\d+/gi);
  if (figureCaptions === 0) {
    issues.push({
      category: 'formatting',
      severity: 'MINOR',
      rule: 'formatting:figures:captions',
      problem: 'No figure captions detected.',
      reason: 'Figures should be labeled (e.g., "Figure 1") for clarity and referencing.',
      fix: 'Add numbered figure captions in the format "Figure X".',
    });
  }

  const tableCaptions = countOccurrences(text, /\bTable\s+\d+/gi);
  if (tableCaptions === 0) {
    issues.push({
      category: 'formatting',
      severity: 'MINOR',
      rule: 'formatting:tables:captions',
      problem: 'No table captions detected.',
      reason: 'Tables should be labeled (e.g., "Table 1") for clarity and referencing.',
      fix: 'Add numbered table captions in the format "Table X".',
    });
  }

  const rawScore = issues.reduce((score, issue) => score - scorePenalty(issue.severity), BASE_SCORE);
  return {
    score: Math.max(0, rawScore),
    issues,
  };
};
