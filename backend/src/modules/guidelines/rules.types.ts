export type GuidelineRules = {
  university: string;
  program?: string;
  semester: string;
  requiredSections?: string[];
  abstract?: {
    minWords?: number;
    maxWords?: number;
  };
  references?: {
    required?: boolean;
    patterns?: string[];
  };
  figures?: {
    requireCaptionPrefix?: string[];
  };
  tables?: {
    requireCaptionPrefix?: string[];
  };
};

export type RuleIssue = {
  severity: 'CRITICAL' | 'MAJOR' | 'MINOR';
  message: string;
  rule: string;
};

export type RuleCheckResult = {
  passed: boolean;
  issues: RuleIssue[];
  summary: string;
};
