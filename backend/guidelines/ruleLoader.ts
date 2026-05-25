import fs from 'fs';
import path from 'path';
import { GuidelineRules, MergedRules } from '../src/types/rules.types';

const GUIDELINES_DIR = path.resolve(process.cwd(), 'guidelines', 'rules');

/**
 * Load and merge common + semester-specific rules
 */
export const loadRules = (semester: string): MergedRules => {
  const commonPath = path.join(GUIDELINES_DIR, 'common', 'format.json');
  const semesterDir = path.join(GUIDELINES_DIR, `${semester}_sem`);

  if (!fs.existsSync(commonPath)) {
    throw new Error(`Common format rules not found at: ${commonPath}`);
  }

  // Load common rules
  const commonRaw = fs.readFileSync(commonPath, 'utf-8');
  const common = JSON.parse(commonRaw) as GuidelineRules;

  // Load semester-specific rules
  const structurePath = path.join(semesterDir, 'structure.json');
  const evaluationPath = path.join(semesterDir, 'evaluation.json');
  const proposalPath = path.join(semesterDir, 'proposal.json');

  let structure: any = {};
  let evaluation: any = {};
  let proposal: any = {};

  if (fs.existsSync(structurePath)) {
    structure = JSON.parse(fs.readFileSync(structurePath, 'utf-8'));
  }
  if (fs.existsSync(evaluationPath)) {
    evaluation = JSON.parse(fs.readFileSync(evaluationPath, 'utf-8'));
  }
  if (fs.existsSync(proposalPath)) {
    proposal = JSON.parse(fs.readFileSync(proposalPath, 'utf-8'));
  }

  // Merge rules
  const merged: MergedRules = {
    ...common,
    ...structure,
    evaluation,
    proposal,
    formatting: {
      ...common.formatting,
      ...(structure.formatting || {})
    },
    requiredSections: [
      ...(common.requiredSections || []),
      ...(structure.requiredSections || [])
    ],
    requiredChapters: [
      ...(common.requiredChapters || []),
      ...(structure.requiredChapters || [])
    ],
    proposalSections: proposal.proposalSections || structure.proposalSections
  };

  return merged;
};

/**
 * Get rules for a specific semester with fallback
 */
export const getRulesForSemester = (semester: string): MergedRules => {
  const normalized = semester.toLowerCase().replace(/sem|semester/gi, '').trim();
  
  const validSemesters = ['4th', '6th', '8th'];
  const semesterKey = validSemesters.includes(normalized) ? normalized : '4th';

  try {
    return loadRules(semesterKey);
  } catch (error) {
    console.error(`Failed to load rules for ${semester}, falling back to 4th semester`, error);
    return loadRules('4th');
  }
};