import { Career, Answers } from '../types';

// ── Synonym mappings ────────────────────────────────────────────
const SYNONYMS: Record<string, string[]> = {
  manager: ['lead', 'leader', 'supervisor', 'director', 'head', 'product owner'],
  developer: ['engineer', 'programmer', 'coder', 'software developer'],
  teacher: ['coach', 'trainer', 'instructor', 'educator'],
  cloud: ['aws', 'azure', 'gcp', 'devops', 'platform', 'infrastructure'],
  ai: ['artificial intelligence', 'machine learning', 'data science', 'ml', 'nlp'],
  sales: ['account manager', 'consultant', 'customer', 'business development'],
  security: ['cybersecurity', 'infosec', 'it security'],
  data: ['analytics', 'big data', 'data analysis', 'data engineer'],
  marketing: ['seo', 'digital marketing', 'brand', 'advertising'],
};

const SENIOR_KEYWORDS = ['manager', 'lead', 'architect', 'senior', 'principal', 'director'];

function expandKeywords(input: string): string[] {
  const words = input.toLowerCase().split(/[\s,]+/).filter(Boolean);
  const expanded = [...words];

  for (const word of words) {
    if (SYNONYMS[word]) {
      expanded.push(...SYNONYMS[word]);
    }
  }

  return expanded;
}

function containsAny(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((k) => lower.includes(k));
}

// Parse years_total answer into a number
function parseYears(answer: string): number {
  if (!answer) return 0;
  if (answer === 'None') return 0;
  if (answer === '1-2 years') return 2;
  if (answer === '3-5 years') return 4;
  if (answer === '5-10 years') return 7;
  if (answer === '10+ years') return 12;
  return parseInt(answer) || 0;
}

// ── Main scoring function ───────────────────────────────────────
export function calculateMatchScore(career: Career, answers: Answers): number {
  let score = 0;
  const careerText = `${career.name} ${career.category} ${career.description} ${career.skills.join(' ')} ${career.education.join(' ')}`.toLowerCase();

  // 1. Desired Role Matching (strongest signal)
  const desiredRole = (answers.desired_role || '').toLowerCase();
  if (desiredRole) {
    const keywords = expandKeywords(desiredRole);
    for (const kw of keywords) {
      if (career.name.toLowerCase().includes(kw)) score += 6;
      else if (career.category.toLowerCase().includes(kw)) score += 4;
      else if (career.description.toLowerCase().includes(kw)) score += 3;
      else if (career.skills.some((s) => s.toLowerCase().includes(kw))) score += 3;
      else if (career.education.some((e) => e.toLowerCase().includes(kw))) score += 3;
      else if (careerText.includes(kw)) score += 2;
    }
  }

  // 2. Education Match
  const education = (answers.education || '').toLowerCase();
  if (education && career.education.length > 0) {
    if (career.education.some((e) => e.toLowerCase().includes(education))) {
      score += 3;
    } else {
      score -= 1;
    }
  }

  // 3. Experience Scoring
  const yearsTotal = parseYears(answers.years_total);
  const isSeniorCareer = containsAny(career.name, SENIOR_KEYWORDS);

  if (isSeniorCareer) {
    if (yearsTotal >= 8) score += 4;
    else if (yearsTotal >= 5) score += 3;
    else if (yearsTotal >= 3) score += 2;
    else if (yearsTotal >= 1) score += 1;
    else score -= 1;
  } else if (yearsTotal > 0) {
    score += 1;
  }

  // 4. Skills Matching
  const userSkills = (answers.skills || '').toLowerCase().split(',').map((s: string) => s.trim()).filter(Boolean);
  for (const skill of userSkills) {
    if (careerText.includes(skill)) score += 2;
  }

  // 5. Interest Matching (from multi-select)
  const interests: string[] = answers.interests || [];

  if (interests.includes('Coding')) {
    if (containsAny(careerText, ['developer', 'programmer', 'engineer', 'coder', 'software'])) score += 3;
  }

  if (interests.includes('Cloud / DevOps')) {
    if (containsAny(careerText, ['cloud', 'devops', 'aws', 'azure', 'infrastructure'])) score += 3;
  }

  if (interests.includes('AI / Machine Learning')) {
    if (containsAny(careerText, ['ai', 'machine learning', 'data science', 'ml', 'artificial intelligence'])) score += 3;
  }

  if (interests.includes('Management')) {
    if (containsAny(careerText, SENIOR_KEYWORDS)) score += 4;
  }

  if (interests.includes('Sales / Consulting')) {
    if (containsAny(careerText, ['sales', 'customer', 'account', 'consulting'])) score += 3;
  }

  if (interests.includes('Creative / Design')) {
    if (containsAny(careerText, ['design', 'creative', 'ux', 'ui', 'graphic', 'visual'])) score += 3;
  }

  if (interests.includes('Healthcare')) {
    if (containsAny(careerText, ['health', 'medical', 'nurse', 'doctor', 'clinical'])) score += 3;
  }

  if (interests.includes('Education')) {
    if (containsAny(careerText, ['teacher', 'education', 'instructor', 'training', 'coach'])) score += 3;
  }

  // Penalty: if no interests match the career at all
  if (interests.length > 0) {
    const hasCoding = interests.includes('Coding') && containsAny(careerText, ['developer', 'programmer', 'engineer', 'coder', 'software']);
    const hasManagement = interests.includes('Management') && containsAny(careerText, SENIOR_KEYWORDS);
    if (!hasCoding && !hasManagement && interests.includes('Coding')) {
      // User wants coding but career is not coding-related
      if (!containsAny(careerText, ['developer', 'programmer', 'engineer', 'software'])) score -= 1;
    }
  }

  // 6. Work Style
  const workStyle = (answers.work_style || '').toLowerCase();
  if (workStyle === 'remote' && containsAny(careerText, ['remote', 'work from home', 'distributed'])) score += 2;
  if (workStyle === 'hybrid' && containsAny(careerText, ['hybrid', 'flexible'])) score += 2;

  // 7. Preference Scales
  const salaryImportance = parseInt(answers.salary_importance) || 3;
  score += (salaryImportance - 3);

  const growthImportance = parseInt(answers.growth_importance) || 3;
  if (containsAny(careerText, ['growth', 'learning', 'advancement'])) {
    score += (growthImportance - 3);
  }

  return Math.max(0, score);
}

// ── Get top N matched careers ───────────────────────────────────
export function matchCareers(
  careers: Career[],
  answers: Answers,
  topN: number = 3
): { career: Career; score: number }[] {
  const scored = careers.map((career) => ({
    career,
    score: calculateMatchScore(career, answers),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topN);
}
