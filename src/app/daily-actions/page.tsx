'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import ProgressBar from '@/components/ProgressBar';
import {
  getDailyActionsPrefs,
  saveDailyActionsPrefs,
  getDailyActionsState,
  saveDailyActionsState,
} from '@/services/firestore';
import {
  generateDailyActions,
  getTodayString,
  getActionEmoji,
  getActionColor,
} from '@/data/dailyActions';
import { DailyAction, DailyActionsPrefs, DEFAULT_DAILY_PREFS } from '@/types';

export default function DailyActionsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUser();

  const [actions, setActions] = useState<DailyAction[]>([]);
  const [prefs, setPrefs] = useState<DailyActionsPrefs>(DEFAULT_DAILY_PREFS);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!user) return;

    try {
      const [savedPrefs, savedState] = await Promise.all([
        getDailyActionsPrefs(user.uid),
        getDailyActionsState(user.uid),
      ]);

      setPrefs(savedPrefs);

      const today = getTodayString();
      if (savedState && savedState.date === today) {
        setActions(savedState.actions);
      } else {
        const newActions = generateDailyActions(today, savedPrefs.actionsPerDay);
        setActions(newActions);
        await saveDailyActionsState(user.uid, {
          date: today,
          actions: newActions,
          prefs: savedPrefs,
        });
      }
    } catch (err) {
      console.error('Failed to load daily actions:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading || profileLoading) return;
    if (!user) { router.replace('/login'); return; }
    loadData();
  }, [user, authLoading, profileLoading, router, loadData]);

  const toggleAction = async (actionId: string) => {
    if (!user) return;

    const updated = actions.map((a) =>
      a.id === actionId ? { ...a, completed: !a.completed } : a,
    );
    setActions(updated);

    await saveDailyActionsState(user.uid, {
      date: getTodayString(),
      actions: updated,
      prefs,
    });
  };

  const updatePrefs = async (newPrefs: Partial<DailyActionsPrefs>) => {
    if (!user) return;

    const merged = { ...prefs, ...newPrefs };
    setPrefs(merged);
    await saveDailyActionsPrefs(user.uid, merged);

    // Regenerate if actions per day changed
    if (newPrefs.actionsPerDay && newPrefs.actionsPerDay !== prefs.actionsPerDay) {
      const today = getTodayString();
      const newActions = generateDailyActions(today, merged.actionsPerDay);
      setActions(newActions);
      await saveDailyActionsState(user.uid, {
        date: today,
        actions: newActions,
        prefs: merged,
      });
    }
  };

  if (authLoading || profileLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
        <Navbar />
        <main className="max-w-2xl mx-auto px-5 pt-4 pb-10">
          <PageHeader title="Daily Actions" subtitle="Loading..." />
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </main>
      </div>
    );
  }

  const completedCount = actions.filter((a) => a.completed).length;
  const totalCount = actions.length;
  const completionPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const motivationalQuotes = [
    'Small steps every day lead to big results.',
    'Consistency beats intensity. Keep showing up!',
    'You are one step closer than you were yesterday.',
    'Every expert was once a beginner.',
    'Progress, not perfection.',
  ];
  const quoteIndex = new Date().getDate() % motivationalQuotes.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
      <Navbar />
      <main className="max-w-2xl mx-auto px-5 pt-4 pb-10">
        <PageHeader title="Daily Actions" subtitle="Your personalized daily to-dos" />

        {/* Progress Card */}
        <div className="glass-card rounded-2xl p-5 mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-text-primary">Today&apos;s Progress</h2>
            <span className="text-sm font-bold text-accent">
              {completedCount}/{totalCount} ({completionPercent}%)
            </span>
          </div>
          <ProgressBar progress={completionPercent / 100} showPercent={false} height={8} />
          {completedCount === totalCount && totalCount > 0 && (
            <p className="text-xs text-primary font-semibold mt-2 text-center">
              All done! You crushed it today! 🎉
            </p>
          )}
        </div>

        {/* Settings Toggle */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="w-full flex items-center justify-between glass-card rounded-2xl p-4 mb-4 hover:bg-bg-card-hover transition-colors"
        >
          <span className="text-sm font-semibold text-text-primary">Settings</span>
          <span className="text-text-muted">{showSettings ? '▲' : '▼'}</span>
        </button>

        {/* Settings Panel */}
        {showSettings && (
          <div className="glass-card rounded-2xl p-5 mb-4 space-y-4">
            {/* Enable Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-text-primary">Enable Daily Actions</p>
                <p className="text-[11px] text-text-secondary">Get personalized daily to-dos</p>
              </div>
              <button
                onClick={() => updatePrefs({ enabled: !prefs.enabled })}
                className={`w-12 h-6 rounded-full transition-colors relative ${prefs.enabled ? 'bg-primary-muted' : 'bg-border'}`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full transition-all ${prefs.enabled ? 'left-6 bg-primary' : 'left-0.5 bg-text-muted'}`}
                />
              </button>
            </div>

            {/* Show on Home Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-text-primary">Show on Home</p>
                <p className="text-[11px] text-text-secondary">Display actions on home screen</p>
              </div>
              <button
                onClick={() => updatePrefs({ showOnHome: !prefs.showOnHome })}
                className={`w-12 h-6 rounded-full transition-colors relative ${prefs.showOnHome ? 'bg-primary-muted' : 'bg-border'}`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full transition-all ${prefs.showOnHome ? 'left-6 bg-primary' : 'left-0.5 bg-text-muted'}`}
                />
              </button>
            </div>

            {/* Actions per Day */}
            <div>
              <p className="text-sm font-semibold text-text-primary mb-2">Actions per Day</p>
              <div className="flex gap-2">
                {[2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => updatePrefs({ actionsPerDay: n })}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      prefs.actionsPerDay === n
                        ? 'bg-primary text-white'
                        : 'glass-card text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Disabled State */}
        {!prefs.enabled && (
          <div className="glass-card rounded-2xl p-8 text-center">
            <p className="text-4xl mb-3">🔕</p>
            <h3 className="text-lg font-bold text-text-primary mb-2">Daily Actions Disabled</h3>
            <p className="text-sm text-text-secondary">
              Turn on daily actions in the settings above to get personalized to-dos each day.
            </p>
          </div>
        )}

        {/* Action Cards */}
        {prefs.enabled && (
          <div className="space-y-3">
            {actions.map((action) => {
              const emoji = getActionEmoji(action.type);
              const color = getActionColor(action.type);

              return (
                <div
                  key={action.id}
                  className={`glass-card rounded-2xl p-4 transition-all ${
                    action.completed ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleAction(action.id)}
                      className={`w-6 h-6 rounded-lg border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                        action.completed
                          ? 'bg-primary border-primary'
                          : 'border-border-light hover:border-primary'
                      }`}
                    >
                      {action.completed && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${color}20`,
                            color: color,
                          }}
                        >
                          {action.type}
                        </span>
                        <span className="text-sm">{emoji}</span>
                      </div>
                      <p
                        className={`text-sm font-semibold text-text-primary ${
                          action.completed ? 'line-through' : ''
                        }`}
                      >
                        {action.title}
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5">{action.description}</p>
                    </div>

                    {/* Go Arrow */}
                    {!action.completed && (
                      <button
                        onClick={() => router.push(action.route)}
                        className="text-text-muted hover:text-primary transition-colors flex-shrink-0 mt-1"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Motivational Footer */}
        {prefs.enabled && (
          <div className="mt-6 text-center">
            <p className="text-sm text-text-muted italic">
              &ldquo;{motivationalQuotes[quoteIndex]}&rdquo;
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
