// ── Daily Actions Generator ──────────────────────────────────────
// Creates personalized daily action items based on user's career progress.

import { DailyAction, DailyActionType } from '../types';

// ── Action Templates ────────────────────────────────────────────

interface ActionTemplate {
  type: DailyActionType;
  title: string;
  description: string;
  route: string;
}

const ACTION_POOL: ActionTemplate[] = [
  // Learning
  {
    type: 'learning',
    title: 'Continue your learning path',
    description: 'Complete the next step in your personalized career roadmap.',
    route: '/career-manager',
  },
  {
    type: 'learning',
    title: 'Watch a tutorial',
    description: 'Spend 20 minutes learning a new skill for your career.',
    route: '/career-manager',
  },
  {
    type: 'learning',
    title: 'Read an industry article',
    description: 'Stay up to date with trends in your target field.',
    route: '/career-manager',
  },
  {
    type: 'learning',
    title: 'Review what you learned yesterday',
    description: 'Reinforce knowledge by reviewing recent study material.',
    route: '/career-manager',
  },

  // Job search
  {
    type: 'job',
    title: 'Browse job listings',
    description: 'Search for 3 new job openings that match your career goal.',
    route: '/job-search',
  },
  {
    type: 'job',
    title: 'Save a job you like',
    description: 'Find and save an interesting position for later review.',
    route: '/job-search',
  },
  {
    type: 'job',
    title: 'Research a company',
    description: 'Pick a company in your field and learn about their culture.',
    route: '/job-search',
  },

  // Interview
  {
    type: 'interview',
    title: 'Practice an interview question',
    description: 'Answer one STAR-method question to sharpen your skills.',
    route: '/interview-prep',
  },
  {
    type: 'interview',
    title: 'Review common questions',
    description: 'Go through 5 common interview questions for your career.',
    route: '/interview-prep',
  },
  {
    type: 'interview',
    title: 'Record a mock answer',
    description: 'Practice answering a question out loud for 2 minutes.',
    route: '/interview-prep',
  },

  // Resume
  {
    type: 'resume',
    title: 'Update your resume',
    description: 'Add a new skill or experience to your CV.',
    route: '/cv',
  },
  {
    type: 'resume',
    title: 'Write a summary statement',
    description: 'Craft or improve your professional summary for your CV.',
    route: '/cv',
  },
  {
    type: 'resume',
    title: 'Add a project or achievement',
    description: 'Document a recent accomplishment on your resume.',
    route: '/cv',
  },

  // Networking
  {
    type: 'networking',
    title: 'Join a community',
    description: 'Explore a Reddit, Discord or LinkedIn group for your field.',
    route: '/networking',
  },
  {
    type: 'networking',
    title: 'Connect with someone',
    description: 'Send a message or connection request to someone in your industry.',
    route: '/networking',
  },
  {
    type: 'networking',
    title: 'Read networking tips',
    description: 'Review networking strategies tailored to your career path.',
    route: '/networking',
  },

  // Community
  {
    type: 'community',
    title: 'Post in the community',
    description: 'Share your progress or ask a question in the community forum.',
    route: '/community',
  },
  {
    type: 'community',
    title: 'Help someone out',
    description: 'Reply to a community post with helpful advice or encouragement.',
    route: '/community',
  },
  {
    type: 'community',
    title: 'Read community posts',
    description: 'Browse what others are discussing and find inspiration.',
    route: '/community',
  },

  // Skills
  {
    type: 'skills',
    title: 'Check your skills gap',
    description: 'Review which skills you still need for your target career.',
    route: '/skills-gap',
  },
  {
    type: 'skills',
    title: 'Learn a missing skill',
    description: 'Pick one skill from your gap analysis and start learning it.',
    route: '/skills-gap',
  },
  {
    type: 'skills',
    title: 'Ask AI Coach for advice',
    description: 'Chat with your AI Career Coach about your next move.',
    route: '/ai-chat',
  },
];

// ── Generator ───────────────────────────────────────────────────

/**
 * Deterministic daily seed based on date string.
 * Same date always produces the same actions for consistency.
 */
function dateSeed(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const ch = dateStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + ch;
    hash |= 0; // 32-bit int
  }
  return Math.abs(hash);
}

/**
 * Simple seeded pseudo-random number generator (mulberry32).
 */
function seededRandom(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generate daily actions for a given date.
 * Uses a seeded random so the same date always produces the same actions,
 * but ensures variety by picking from different categories.
 */
export function generateDailyActions(
  date: string,
  count: number = 3,
): DailyAction[] {
  const seed = dateSeed(date);
  const rng = seededRandom(seed);

  // Shuffle pool using Fisher-Yates with seeded random
  const pool = [...ACTION_POOL];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // Pick actions ensuring variety (no duplicate types until we have to)
  const selected: ActionTemplate[] = [];
  const usedTypes = new Set<DailyActionType>();

  // First pass: one from each type
  for (const action of pool) {
    if (selected.length >= count) break;
    if (!usedTypes.has(action.type)) {
      selected.push(action);
      usedTypes.add(action.type);
    }
  }

  // Second pass: fill remaining if count > unique types
  if (selected.length < count) {
    for (const action of pool) {
      if (selected.length >= count) break;
      if (!selected.includes(action)) {
        selected.push(action);
      }
    }
  }

  return selected.map((tmpl, idx) => ({
    id: `${date}-${idx}`,
    type: tmpl.type,
    title: tmpl.title,
    description: tmpl.description,
    route: tmpl.route,
    completed: false,
  }));
}

/**
 * Get today's date string in YYYY-MM-DD format.
 */
export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get an emoji for each action type.
 */
export function getActionEmoji(type: DailyActionType): string {
  const map: Record<DailyActionType, string> = {
    learning: '📚',
    job: '🔍',
    interview: '🎤',
    resume: '📄',
    networking: '🤝',
    community: '💬',
    skills: '⚡',
  };
  return map[type] || '✅';
}

/**
 * Get a color tint for each action type.
 */
export function getActionColor(type: DailyActionType): string {
  const map: Record<DailyActionType, string> = {
    learning: '#64ffda',
    job: '#ffd93d',
    interview: '#ff6b6b',
    resume: '#a78bfa',
    networking: '#38bdf8',
    community: '#fb923c',
    skills: '#34d876',
  };
  return map[type] || '#64ffda';
}
