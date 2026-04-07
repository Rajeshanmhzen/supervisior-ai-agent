import { GuidelineRules, RuleCheckResult, RuleIssue } from './rules.types';

const normalize = (value: string) => value.toLowerCase();

const findSectionIndex = (text: string, section: string) => {
  const pattern = new RegExp(`(^|\\n)\\s*${section}\\s*(\\n|:)`, 'i');
  const match = pattern.exec(text);
  return match ? match.index : -1;
};

const extractSection = (text: string, section: string, nextSections: string[]) => {
  const start = findSectionIndex(text, section);
  if (start < 0) return '';
  const afterStart = text.slice(start + section.length);
  let end = afterStart.length;
  for (const next of nextSections) {
    const idx = findSectionIndex(afterStart, next);
    if (idx >= 0 && idx < end) end = idx;
  }
  return afterStart.slice(0, end).trim();
};

const wordCount = (text: string) =>
  text
    .replace(/[^A-Za-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;

export const runRuleChecks = (text: string, rules: GuidelineRules): RuleCheckResult => {
  const issues: RuleIssue[] = [];
  const lower = normalize(text);

  const required = rules.requiredSections || [];
  for (const section of required) {
    const idx = findSectionIndex(text, section);
    if (idx < 0) {
      issues.push({
        severity: 'CRITICAL',
        rule: `section:${section}`,
        message: `Missing required section: ${section}.`,
      });
    }
  }

  if (rules.abstract) {
    const next = required.filter((s) => normalize(s) !== 'abstract');
    const abstractText = extractSection(text, 'Abstract', next);
    if (!abstractText) {
      issues.push({
        severity: 'MAJOR',
        rule: 'abstract:missing',
        message: 'Abstract section not found.',
      });
    } else {
      const count = wordCount(abstractText);
      if (rules.abstract.minWords && count < rules.abstract.minWords) {
        issues.push({
          severity: 'MAJOR',
          rule: 'abstract:minWords',
          message: `Abstract too short: ${count} words (min ${rules.abstract.minWords}).`,
        });
      }
      if (rules.abstract.maxWords && count > rules.abstract.maxWords) {
        issues.push({
          severity: 'MAJOR',
          rule: 'abstract:maxWords',
          message: `Abstract too long: ${count} words (max ${rules.abstract.maxWords}).`,
        });
      }
    }
  }

  if (rules.references?.required) {
    const refsText = extractSection(text, 'References', []);
    if (!refsText) {
      issues.push({
        severity: 'CRITICAL',
        rule: 'references:missing',
        message: 'References section not found.',
      });
    } else if (rules.references.patterns && rules.references.patterns.length > 0) {
      const hasPattern = rules.references.patterns.some((p) =>
        new RegExp(p, 'i').test(refsText)
      );
      if (!hasPattern) {
        issues.push({
          severity: 'MINOR',
          rule: 'references:pattern',
          message: 'References do not seem to include DOI/URL patterns.',
        });
      }
    }
  }

  if (rules.figures?.requireCaptionPrefix?.length) {
    const hasFigureCaption = rules.figures.requireCaptionPrefix.some((p) =>
      new RegExp(`${p}\\s*\\d+`, 'i').test(text)
    );
    if (!hasFigureCaption) {
      issues.push({
        severity: 'MINOR',
        rule: 'figures:caption',
        message: 'No figure captions detected (e.g., "Figure 1").',
      });
    }
  }

  if (rules.tables?.requireCaptionPrefix?.length) {
    const hasTableCaption = rules.tables.requireCaptionPrefix.some((p) =>
      new RegExp(`${p}\\s*\\d+`, 'i').test(text)
    );
    if (!hasTableCaption) {
      issues.push({
        severity: 'MINOR',
        rule: 'tables:caption',
        message: 'No table captions detected (e.g., "Table 1").',
      });
    }
  }

  return {
    passed: issues.length === 0,
    issues,
    summary: issues.length === 0 ? 'All rule checks passed.' : `${issues.length} issue(s) found.`,
  };
};
