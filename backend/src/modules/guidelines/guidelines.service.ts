import path from 'path';
import fs from 'fs';
import { extractPdfText } from '../file/file.service';
import { GuidelineRules } from './rules.types';

type GuidelineKey = {
  university: string;
  semester: string;
};

const normalize = (value: string) => value.trim().toLowerCase();

const GUIDELINE_MAP: Record<string, string> = {
  // TU BCA 4th semester
  [`${normalize('tu')}|${normalize('4th')}`]: path.resolve(
    process.cwd(),
    'src',
    'guidelines',
    'tu',
    'Project Work Details for BCA 4th sem.pdf'
  ),
};

const cache = new Map<string, string>();
const rulesCache = new Map<string, GuidelineRules>();

const RULES_MAP: Record<string, string> = {
  [`${normalize('tu')}|${normalize('4th')}`]: path.resolve(
    process.cwd(),
    'src',
    'guidelines',
    'tu',
    '4th.json'
  ),
};

export const getGuidelineText = async (input: GuidelineKey) => {
  const key = `${normalize(input.university)}|${normalize(input.semester)}`;
  const filePath = GUIDELINE_MAP[key];
  if (!filePath) return null;

  if (cache.has(filePath)) return cache.get(filePath)!;
  const text = await extractPdfText(filePath);
  cache.set(filePath, text);
  return text;
};

export const getGuidelineRules = (input: GuidelineKey) => {
  const key = `${normalize(input.university)}|${normalize(input.semester)}`;
  const filePath = RULES_MAP[key];
  if (!filePath) return null;
  if (rulesCache.has(filePath)) return rulesCache.get(filePath)!;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const rules = JSON.parse(raw) as GuidelineRules;
  rulesCache.set(filePath, rules);
  return rules;
};
