'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/useToast';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import Avatar from '@/components/Avatar';
import { PageSkeleton } from '@/components/Skeleton';
import AnimatedPage from '@/components/AnimatedPage';
import { getCompletedSteps, getActivityLog, getCareer, getLearningPath, getApplications, getInterviewAttempts } from '@/services/firestore';
import { computeBadges, calculateStreak } from '@/data/badges';
import { analyzeSkillsGap } from '@/utils/skillsMatcher';
import { ActivityLog, Career, Badge } from '@/types';

interface TimelineEvent {
  date: string;
  timestamp: number;
  icon: string;
  title: string;
  description: string;
}

export default function ProgressStoryPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUser();
  const toast = useToast();

  const [career, setCareer] = useState<Career | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [daysInJourney, setDaysInJourney] = useState(0);
  const [streakCurrent, setStreakCurrent] = useState(0);
  const [stepsCompleted, setStepsCompleted] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [badgesEarned, setBadgesEarned] = useState(0);
  const [totalBadges, setTotalBadges] = useState(0);
  const [applicationCount, setApplicationCount] = useState(0);
  const [interviewCount, setInterviewCount] = useState(0);
  const [matchPercent, setMatchPercent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || profileLoading) return;
    if (!user) { router.replace('/login'); return; }
    if (!profile?.chosenCareer) { setLoading(false); return; }

    const load = async () => {
      try {
        const [c, completed, log, path, apps, attempts] = await Promise.all([
          getCareer(profile.chosenCareer),
          getCompletedSteps(user.uid, profile.chosenCareer),
          getActivityLog(user.uid, profile.chosenCareer),
          getLearningPath(user.uid, profile.chosenCareer),
          getApplications(user.uid),
          getInterviewAttempts(user.uid),
        ]);

        setCareer(c);
        setStepsCompleted(completed.length);
        setApplicationCount(apps.length);
        setInterviewCount(attempts.length);

        const steps = path?.learning_path?.length || c?.steps?.length || 0;
        setTotalSteps(steps);

        const streak = calculateStreak(log);
        setStreakCurrent(streak.current);

        const badges = computeBadges(completed.length, steps, log);
        setBadgesEarned(badges.filter((b) => b.earned).length);
        setTotalBadges(badges.length);

        // Skills match
        if (c && profile.skills) {
          const gap = analyzeSkillsGap(profile.skills, c.skills || [], c.skillsURL || []);
          setMatchPercent(gap.matchPercentage);
        }

        // Days in journey
        if (profile.createdAt) {
          const days = Math.max(1, Math.floor((Date.now() - profile.createdAt) / (1000 * 60 * 60 * 24)));
          setDaysInJourney(days);
        }

        // Build timeline
        const events: TimelineEvent[] = [];

        // Account creation
        if (profile.createdAt) {
          events.push({
            date: new Date(profile.createdAt).toISOString().split('T')[0],
            timestamp: profile.createdAt,
            icon: '🚀',
            title: 'Journey Started',
            description: 'You created your account and began your career journey.',
          });
        }

        // Activity log events
        log.forEach((entry: ActivityLog) => {
          const ts = new Date(entry.date).getTime();
          const actionLabel = entry.action.replace(/_/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase());
          events.push({
            date: entry.date,
            timestamp: ts,
            icon: entry.action.includes('step') ? '✅' : entry.action.includes('career') ? '🎯' : '📝',
            title: actionLabel,
            description: entry.details || '',
          });
        });

        // Badges earned
        badges.filter((b: Badge) => b.earned).forEach((b: Badge) => {
          events.push({
            date: new Date().toISOString().split('T')[0],
            timestamp: Date.now(),
            icon: b.icon,
            title: `Badge: ${b.name}`,
            description: b.description,
          });
        });

        // Applications
        apps.forEach((app) => {
          events.push({
            date: new Date(app.dateApplied).toISOString().split('T')[0],
            timestamp: app.dateApplied,
            icon: '📋',
            title: `Applied: ${app.position}`,
            description: `${app.company} - ${app.status.replace(/_/g, ' ')}`,
          });
        });

        // Interview attempts
        attempts.forEach((a) => {
          events.push({
            date: new Date(a.attemptedAt).toISOString().split('T')[0],
            timestamp: a.attemptedAt,
            icon: '🎤',
            title: 'Interview Practice',
            description: `Self-rated: ${a.selfRating}/5`,
          });
        });

        // Streak milestones
        if (streak.longest >= 7) {
          events.push({
            date: new Date().toISOString().split('T')[0],
            timestamp: Date.now(),
            icon: '🔥',
            title: '7-Day Streak Achieved',
            description: 'You stayed active for a whole week!',
          });
        }
        if (streak.longest >= 30) {
          events.push({
            date: new Date().toISOString().split('T')[0],
            timestamp: Date.now(),
            icon: '💎',
            title: '30-Day Streak Achieved',
            description: 'An entire month of consistency!',
          });
        }

        // Deduplicate by title+date and sort chronologically
        const unique = events.filter(
          (e, i, arr) => arr.findIndex((x) => x.title === e.title && x.date === e.date) === i,
        );
        unique.sort((a, b) => a.timestamp - b.timestamp);
        setTimeline(unique);
      } catch (err) {
        console.error('Failed to load story:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user, profile, authLoading, profileLoading, router]);

  const handleShare = () => {
    const text = [
      `My Career Journey - ${career?.name || 'Career Path'}`,
      `${daysInJourney} days in | ${streakCurrent}-day streak`,
      `${stepsCompleted}/${totalSteps} steps completed`,
      `${badgesEarned} badges earned`,
      `${applicationCount} applications sent`,
      `${matchPercent}% skills match`,
      '',
      'Powered by MyFutureCareer',
    ].join('\n');

    navigator.clipboard.writeText(text).then(() => {
      toast.info('Journey summary copied to clipboard!');
    }).catch(() => {
      toast.error('Could not copy to clipboard.');
    });
  };

  if (authLoading || profileLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
        <Navbar />
        <AnimatedPage>
          <main className="max-w-2xl mx-auto px-5 pt-4 pb-10">
            <PageHeader title="My Journey" subtitle="Loading..." />
          <PageSkeleton />
        </main>
        </AnimatedPage>
      </div>
    );
  }

  if (!profile?.chosenCareer) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
        <Navbar />
        <AnimatedPage>
          <main className="max-w-2xl mx-auto px-5 pt-4 pb-10">
            <PageHeader title="My Journey" subtitle="Your progress story" />
          <div className="glass-card rounded-2xl p-8 text-center mt-8">
            <p className="text-5xl mb-4">📖</p>
            <h2 className="text-xl font-bold text-text-primary mb-2">No Career Selected</h2>
            <p className="text-text-secondary text-sm mb-6">
              Choose a career path first to see your before &amp; after journey story.
            </p>
            <button
              onClick={() => router.push('/career-match')}
              className="bg-primary text-white px-6 py-3 rounded-2xl font-semibold hover:bg-primary-dark transition-colors"
            >
              Find Your Career
            </button>
          </div>
        </main>
        </AnimatedPage>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
      <Navbar />
      <AnimatedPage>
        <main className="max-w-2xl mx-auto px-5 pt-4 pb-10">
          <PageHeader title="My Journey" subtitle={career?.name || 'Your progress story'} />

        {/* Hero Card */}
        <div className="glass-card-elevated rounded-2xl p-6 mb-5 text-center">
          <Avatar index={profile?.avatar ?? 0} size={72} className="mx-auto mb-3" />
          <h2 className="text-xl font-bold text-text-primary">{profile?.username || 'User'}</h2>
          <p className="text-sm text-text-secondary mt-1">{career?.name}</p>
          <div className="flex justify-center gap-6 mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">{daysInJourney}</p>
              <p className="text-[10px] text-text-muted uppercase tracking-wider">Days</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">{streakCurrent}🔥</p>
              <p className="text-[10px] text-text-muted uppercase tracking-wider">Streak</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">{badgesEarned}</p>
              <p className="text-[10px] text-text-muted uppercase tracking-wider">Badges</p>
            </div>
          </div>
        </div>

        {/* Then vs Now Comparison */}
        <div className="glass-card rounded-2xl p-5 mb-5">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Then vs Now</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-text-muted font-medium">Metric</th>
                  <th className="text-center py-2 text-text-muted font-medium">Day 1</th>
                  <th className="text-center py-2 text-text-muted font-medium">Now</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-2.5 text-text-secondary">Skills Match</td>
                  <td className="text-center text-text-muted">0%</td>
                  <td className="text-center text-accent font-semibold">{matchPercent}%</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2.5 text-text-secondary">Steps Completed</td>
                  <td className="text-center text-text-muted">0</td>
                  <td className="text-center text-accent font-semibold">{stepsCompleted}/{totalSteps}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2.5 text-text-secondary">Applications</td>
                  <td className="text-center text-text-muted">0</td>
                  <td className="text-center text-accent font-semibold">{applicationCount}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2.5 text-text-secondary">Interviews</td>
                  <td className="text-center text-text-muted">0</td>
                  <td className="text-center text-accent font-semibold">{interviewCount}</td>
                </tr>
                <tr>
                  <td className="py-2.5 text-text-secondary">Badges</td>
                  <td className="text-center text-text-muted">0</td>
                  <td className="text-center text-accent font-semibold">{badgesEarned}/{totalBadges}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Timeline */}
        <div className="glass-card rounded-2xl p-5 mb-5">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Timeline</h3>
          {timeline.length > 0 ? (
            <div className="relative ml-3">
              {/* Vertical line */}
              <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border" />
              <div className="space-y-4">
                {timeline.map((event, idx) => (
                  <div key={`${event.date}-${idx}`} className="relative pl-8">
                    {/* Dot */}
                    <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-bg-elevated border-2 border-primary flex items-center justify-center z-10">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    </div>
                    {/* Content */}
                    <div className="glass-card rounded-xl p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{event.icon}</span>
                          <span className="text-sm font-semibold text-text-primary">{event.title}</span>
                        </div>
                        <span className="text-[10px] text-text-muted flex-shrink-0">{event.date}</span>
                      </div>
                      {event.description && (
                        <p className="text-xs text-text-secondary mt-1 ml-7">{event.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-text-muted text-sm py-4">
              No events yet. Start your career path to build your timeline!
            </p>
          )}
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="w-full bg-primary text-white py-3 rounded-2xl font-semibold hover:bg-primary-dark transition-colors text-center"
        >
          Share My Journey
        </button>
      </main>
      </AnimatedPage>
    </div>
  );
}
