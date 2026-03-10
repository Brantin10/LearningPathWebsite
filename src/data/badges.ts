import { Badge, ActivityLog } from '../types';

interface BadgeDef {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const BADGE_DEFS: BadgeDef[] = [
  { id: 'first_step', name: 'First Step', description: 'Complete your first learning step', icon: '\uD83C\uDFAF' },
  { id: 'halfway', name: 'Halfway There', description: 'Complete 50% of your learning path', icon: '\u26A1' },
  { id: 'completed', name: 'Path Complete', description: 'Complete all learning steps', icon: '\uD83C\uDFC6' },
  { id: 'week_streak', name: '7-Day Streak', description: 'Stay active 7 days in a row', icon: '\uD83D\uDD25' },
  { id: 'month_streak', name: '30-Day Streak', description: 'Stay active 30 days in a row', icon: '\uD83D\uDC8E' },
  { id: 'early_bird', name: 'Early Bird', description: 'Complete a step before 9 AM', icon: '\uD83C\uDF05' },
  { id: 'night_owl', name: 'Night Owl', description: 'Complete a step after 10 PM', icon: '\uD83E\uDD89' },
];

export function calculateStreak(activityLog: ActivityLog[]): { current: number; longest: number } {
  if (!activityLog.length) return { current: 0, longest: 0 };

  const uniqueDates = Array.from(new Set(activityLog.map((a) => a.date))).sort().reverse();

  // Current streak: count backwards from today
  let current = 0;
  for (let i = 0; i < uniqueDates.length; i++) {
    const expected = new Date();
    expected.setDate(expected.getDate() - i);
    const expectedStr = expected.toISOString().split('T')[0];
    if (uniqueDates[i] === expectedStr) {
      current++;
    } else {
      break;
    }
  }

  // Longest streak: scan all sorted dates
  const sorted = [...uniqueDates].sort();
  let longest = sorted.length > 0 ? 1 : 0;
  let temp = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      temp++;
      longest = Math.max(longest, temp);
    } else {
      temp = 1;
    }
  }

  return { current, longest: Math.max(longest, current) };
}

export function computeBadges(
  completedCount: number,
  totalSteps: number,
  activityLog: ActivityLog[],
): Badge[] {
  const streak = calculateStreak(activityLog);
  const hour = new Date().getHours();

  const hasEarlyActivity = activityLog.some((a) => {
    // Check if any activity was logged — we approximate time from date string
    // Since we only store date, use current hour for "today" activities
    return a.date === new Date().toISOString().split('T')[0] && hour < 9;
  });

  const hasNightActivity = activityLog.some((a) => {
    return a.date === new Date().toISOString().split('T')[0] && hour >= 22;
  });

  const checks: Record<string, boolean> = {
    first_step: completedCount >= 1,
    halfway: totalSteps > 0 && completedCount >= totalSteps / 2,
    completed: totalSteps > 0 && completedCount >= totalSteps,
    week_streak: streak.current >= 7 || streak.longest >= 7,
    month_streak: streak.current >= 30 || streak.longest >= 30,
    early_bird: hasEarlyActivity,
    night_owl: hasNightActivity,
  };

  return BADGE_DEFS.map((def) => ({
    ...def,
    earned: checks[def.id] || false,
  }));
}
