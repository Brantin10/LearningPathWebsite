'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import ProgressBar from '@/components/ProgressBar';
import { getCompletedSteps, getActivityLog, getCareer, getLearningPath } from '@/services/firestore';
import { computeBadges, calculateStreak } from '@/data/badges';
import { Badge, ActivityLog, Career } from '@/types';

export default function ProgressPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUser();

  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [totalSteps, setTotalSteps] = useState(0);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [career, setCareer] = useState<Career | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || profileLoading) return;
    if (!user) { router.replace('/login'); return; }
    if (!profile?.chosenCareer) { setLoading(false); return; }

    const load = async () => {
      try {
        const [c, completed, log, path] = await Promise.all([
          getCareer(profile.chosenCareer),
          getCompletedSteps(user.uid, profile.chosenCareer),
          getActivityLog(user.uid, profile.chosenCareer),
          getLearningPath(user.uid, profile.chosenCareer),
        ]);
        setCareer(c);
        setCompletedSteps(completed);
        setActivityLog(log);

        const steps = path?.learning_path?.length || c?.steps?.length || 0;
        setTotalSteps(steps);

        const b = computeBadges(completed.length, steps, log);
        setBadges(b);
      } catch (err) {
        console.error('Failed to load progress:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user, profile, authLoading, profileLoading, router]);

  if (authLoading || profileLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
        <Navbar />
        <main className="max-w-2xl mx-auto px-5 pt-4 pb-10">
          <PageHeader title="Progress" subtitle="Loading..." />
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </main>
      </div>
    );
  }

  if (!profile?.chosenCareer) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
        <Navbar />
        <main className="max-w-2xl mx-auto px-5 pt-4 pb-10">
          <PageHeader title="Progress" subtitle="Track your career journey" />
          <div className="glass-card rounded-2xl p-8 text-center mt-8">
            <p className="text-5xl mb-4">🎯</p>
            <h2 className="text-xl font-bold text-text-primary mb-2">No Career Selected</h2>
            <p className="text-text-secondary text-sm mb-6">
              Choose a career path first to start tracking your progress, earning badges, and building streaks.
            </p>
            <button
              onClick={() => router.push('/career-match')}
              className="bg-primary text-white px-6 py-3 rounded-2xl font-semibold hover:bg-primary-dark transition-colors"
            >
              Find Your Career
            </button>
          </div>
        </main>
      </div>
    );
  }

  const progressPercent = totalSteps > 0 ? Math.round((completedSteps.length / totalSteps) * 100) : 0;
  const streak = calculateStreak(activityLog);
  const earnedBadges = badges.filter((b) => b.earned);
  const lockedBadges = badges.filter((b) => !b.earned);

  const recentActivity = [...activityLog]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  const formatAction = (action: string): string => {
    return action
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
      <Navbar />
      <main className="max-w-2xl mx-auto px-5 pt-4 pb-10">
        <PageHeader title="Progress" subtitle={career?.name || 'Track your career journey'} />

        {/* Overall Progress */}
        <div className="glass-card rounded-2xl p-5 mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-text-primary">Overall Progress</h2>
            <span className="text-2xl font-bold text-accent">{progressPercent}%</span>
          </div>
          <ProgressBar progress={progressPercent / 100} showPercent={false} height={10} />
          <p className="text-xs text-text-secondary mt-2">
            {completedSteps.length} of {totalSteps} steps completed
          </p>
        </div>

        {/* Streak Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="glass-card rounded-2xl p-4 text-center">
            <p className="text-3xl mb-1">🔥</p>
            <p className="text-3xl font-bold text-text-primary">{streak.current}</p>
            <p className="text-xs text-text-secondary mt-1">Current Streak</p>
            <p className="text-[10px] text-text-muted">days in a row</p>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <p className="text-3xl mb-1">💎</p>
            <p className="text-3xl font-bold text-text-primary">{streak.longest}</p>
            <p className="text-xs text-text-secondary mt-1">Best Streak</p>
            <p className="text-[10px] text-text-muted">personal record</p>
          </div>
        </div>

        {/* Badge Grid */}
        <div className="glass-card rounded-2xl p-5 mb-4">
          <h2 className="text-lg font-semibold text-text-primary mb-3">
            Badges ({earnedBadges.length}/{badges.length})
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {earnedBadges.map((badge) => (
              <div
                key={badge.id}
                className="glass-card-elevated rounded-xl p-3 text-center"
              >
                <p className="text-2xl mb-1">{badge.icon}</p>
                <p className="text-xs font-semibold text-text-primary leading-tight">{badge.name}</p>
                <p className="text-[10px] text-text-secondary mt-0.5 leading-tight">{badge.description}</p>
              </div>
            ))}
            {lockedBadges.map((badge) => (
              <div
                key={badge.id}
                className="glass-card rounded-xl p-3 text-center opacity-30"
              >
                <p className="text-2xl mb-1">{badge.icon}</p>
                <p className="text-xs font-semibold text-text-primary leading-tight">{badge.name}</p>
                <p className="text-[10px] text-text-secondary mt-0.5 leading-tight">{badge.description}</p>
              </div>
            ))}
          </div>
          {earnedBadges.length === 0 && (
            <p className="text-center text-text-muted text-sm mt-3">
              Complete steps and stay active to earn badges!
            </p>
          )}
        </div>

        {/* Recent Activity */}
        <div className="glass-card rounded-2xl p-5">
          <h2 className="text-lg font-semibold text-text-primary mb-3">Recent Activity</h2>
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((entry, idx) => (
                <div
                  key={`${entry.date}-${idx}`}
                  className="flex items-start gap-3 py-2 border-b border-border last:border-b-0"
                >
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary">
                      {formatAction(entry.action)}
                    </p>
                    {entry.details && (
                      <p className="text-xs text-text-secondary mt-0.5">{entry.details}</p>
                    )}
                  </div>
                  <span className="text-[10px] text-text-muted flex-shrink-0">{entry.date}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-text-muted text-sm py-4">
              No activity yet. Start completing steps to see your history!
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
