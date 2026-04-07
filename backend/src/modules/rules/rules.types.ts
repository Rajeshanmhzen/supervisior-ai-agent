export type IssueSeverity = 'CRITICAL' | 'MAJOR' | 'MINOR';

export type RuleIssue = {
  category: 'formatting' | 'references';
  severity: IssueSeverity;
  problem: string;
  reason: string;
  fix: string;
  rule: string;
};

export type RuleCheckResult = {
  score: number;
  issues: RuleIssue[];
};
