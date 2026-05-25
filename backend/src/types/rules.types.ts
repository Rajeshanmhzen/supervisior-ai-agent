export interface GuidelineRules {
  university?: string;
  program?: string;
  semester: string;
  version?: string;
  lastUpdated?: string;
  sources?: string[];

  // Common Formatting
  formatting?: {
    font?: string;
    bodySize?: number;
    chapterTitleSize?: number;
    sectionTitleSize?: number;
    subSectionTitleSize?: number;
    lineSpacing?: number;
    alignment?: string;
    margins?: {
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
    };
    pageNumbering?: {
      preliminary?: string;
      main?: string;
      startMainAt?: number;
      position?: string;
    };
    paperSize?: string;
  };

  // Structure Rules
  requiredSections?: string[];
  requiredChapters?: string[];
  chapterDetails?: Record<string, string[]>;

  // Proposal Rules
  proposalSections?: string[];
  methodologySubSections?: string[];

  // Evaluation Rules
  evaluationCriteria?: any;
  scoring?: {
    total?: number;
    breakdown?: Array<{
      stage: string;
      weight: number;
      evaluators?: string[];
    }>;
  };

  // Other Rules
  referencing?: {
    style?: string;
    required?: boolean;
  };
  figuresAndTables?: any;
}

// Extended merged rules used by the engine
export interface MergedRules extends GuidelineRules {
  formatting: any;
  requiredSections: string[];
  requiredChapters: string[];
  proposalSections?: string[];
  evaluation?: any;
  proposal?: any;
}

export interface RuleIssue {
  severity: 'CRITICAL' | 'MAJOR' | 'MINOR';
  rule: string;
  message: string;
  fix?: string;
}

export interface RuleCheckResult {
  passed: boolean;
  issues: RuleIssue[];
  summary: string;
  score?: number;
  isProposal?: boolean;
}