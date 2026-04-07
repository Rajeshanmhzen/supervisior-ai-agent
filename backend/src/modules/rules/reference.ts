import { RuleCheckResult, RuleIssue } from './rules.types';

const BASE_SCORE = 15;

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

const extractSection = (text: string, section: string) => {
  const pattern = new RegExp(`(^|\\n)\\s*${section}\\s*(\\n|:)`, 'i');
  const match = pattern.exec(text);
  if (!match) return '';
  const start = match.index + match[0].length;
  const after = text.slice(start);
  const nextHeading = after.search(/\n\s*[A-Z][A-Za-z0-9\s]{2,}\n/);
  return (nextHeading >= 0 ? after.slice(0, nextHeading) : after).trim();
};

export const runReferenceRules = (text: string): RuleCheckResult => {
  const issues: RuleIssue[] = [];
  const refsText = extractSection(text, 'References');

  if (!refsText) {
    issues.push({
      category: 'references',
      severity: 'CRITICAL',
      rule: 'references:missing',
      problem: 'References section missing.',
      reason: 'A References section is required to document sources and citations.',
      fix: 'Add a "References" section and list all cited sources.',
    });
  } else {
    const doiOrUrl = /(doi:\s*10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+)|(https?:\/\/\S+)/i;
    if (!doiOrUrl.test(refsText)) {
      issues.push({
        category: 'references',
        severity: 'MAJOR',
        rule: 'references:doi-or-url',
        problem: 'References lack DOI/URL patterns.',
        reason: 'References should include persistent identifiers or URLs where applicable.',
        fix: 'Include DOI links or URLs for each reference when available.',
      });
    }

    const count = refsText.split('\n').filter((line) => line.trim().length > 3).length;
    if (count < 3) {
      issues.push({
        category: 'references',
        severity: 'MINOR',
        rule: 'references:count',
        problem: 'Very few references detected.',
        reason: 'Projects typically require multiple sources to support claims.',
        fix: 'Add more relevant citations to strengthen the work.',
      });
    }
  }

  const rawScore = issues.reduce((score, issue) => score - scorePenalty(issue.severity), BASE_SCORE);
  return {
    score: Math.max(0, rawScore),
    issues,
  };
};
