import { SkillMatch, SkillsGapAnalysis } from '../types';

const SYNONYMS: Record<string, string[]> = {
  javascript: ['js', 'ecmascript', 'es6'],
  typescript: ['ts'],
  python: ['py'],
  'react native': ['rn', 'react-native'],
  react: ['reactjs', 'react.js'],
  node: ['nodejs', 'node.js'],
  'node.js': ['node', 'nodejs'],
  css: ['css3'],
  html: ['html5'],
  'c++': ['cpp'],
  'c#': ['csharp', 'c sharp'],
  sql: ['mysql', 'postgresql', 'postgres'],
  aws: ['amazon web services'],
  gcp: ['google cloud'],
  azure: ['microsoft azure'],
  ml: ['machine learning'],
  ai: ['artificial intelligence'],
  ui: ['user interface'],
  ux: ['user experience'],
};

function normalize(skill: string): string {
  const lower = skill.toLowerCase().trim();
  for (const [canonical, alts] of Object.entries(SYNONYMS)) {
    if (lower === canonical || alts.includes(lower)) return canonical;
  }
  return lower;
}

function match(userSkill: string, required: string): 'matched' | 'partial' | 'missing' {
  const u = normalize(userSkill);
  const r = normalize(required);
  if (u === r) return 'matched';
  if (u.includes(r) || r.includes(u)) return 'partial';
  return 'missing';
}

export function analyzeSkillsGap(
  userSkills: string,
  careerSkills: string[],
  careerSkillsUrls: string[],
): SkillsGapAnalysis {
  const userList = userSkills.split(',').map((s) => s.trim()).filter(Boolean);
  const matched: SkillMatch[] = [];
  const missing: SkillMatch[] = [];

  careerSkills.forEach((required, idx) => {
    let best: 'matched' | 'partial' | 'missing' = 'missing';
    let matchedUserSkill: string | undefined;

    for (const us of userList) {
      const result = match(us, required);
      if (result === 'matched') {
        best = 'matched';
        matchedUserSkill = us;
        break;
      }
      if (result === 'partial' && best === 'missing') {
        best = 'partial';
        matchedUserSkill = us;
      }
    }

    const entry: SkillMatch = {
      skill: required,
      status: best,
      userSkill: matchedUserSkill,
      priority: idx < 3 ? 'high' : idx < 6 ? 'medium' : 'low',
      learnUrl: careerSkillsUrls[idx] || undefined,
    };

    if (best === 'matched' || best === 'partial') {
      matched.push(entry);
    } else {
      missing.push(entry);
    }
  });

  const fullMatches = matched.filter((m) => m.status === 'matched').length;
  const pct = careerSkills.length > 0 ? Math.round((fullMatches / careerSkills.length) * 100) : 0;

  return {
    matchedSkills: matched,
    missingSkills: missing,
    matchPercentage: pct,
    totalRequired: careerSkills.length,
  };
}
