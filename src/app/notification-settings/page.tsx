'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getNotificationPreferences, saveNotificationPreferences } from '@/services/firestore';
import { DEFAULT_NOTIFICATION_PREFS, NotificationPreferences } from '@/types';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function NotificationSettingsPage() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<NotificationPreferences>(DEFAULT_NOTIFICATION_PREFS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    getNotificationPreferences(user.uid).then((p) => {
      if (p) setPrefs(p);
    });
  }, [user]);

  const toggle = (key: keyof NotificationPreferences['types']) => {
    setPrefs((prev) => ({ ...prev, types: { ...prev.types, [key]: !prev.types[key] } }));
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await saveNotificationPreferences(user.uid, prefs);
      alert('Preferences saved!');
    } catch {
      alert('Failed to save.');
    } finally {
      setLoading(false);
    }
  };

  const toggleItems = [
    { key: 'daily_reminder' as const, label: 'Daily Reminder', desc: 'Get a daily nudge to keep you on track' },
    { key: 'streak_reminder' as const, label: 'Streak Alerts', desc: 'Don\'t lose your streak!' },
    { key: 'application_followup' as const, label: 'Application Follow-ups', desc: 'Reminders to follow up on job applications' },
    { key: 'weekly_summary' as const, label: 'Weekly Summary', desc: 'Weekly progress recap' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
      <Navbar />
      <main className="max-w-2xl mx-auto px-5 pt-4 pb-10">
        <PageHeader title="Notifications" subtitle="Manage your notification preferences" />

        <Card className="mb-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-text-primary">Enable Notifications</p>
              <p className="text-sm text-text-secondary">Master toggle for all notifications</p>
            </div>
            <button
              onClick={() => setPrefs((p) => ({ ...p, enabled: !p.enabled }))}
              className={`w-12 h-6 rounded-full transition-colors relative ${prefs.enabled ? 'bg-primary-muted' : 'bg-border'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full transition-all ${prefs.enabled ? 'left-6 bg-primary' : 'left-0.5 bg-text-muted'}`} />
            </button>
          </div>
        </Card>

        {prefs.enabled && (
          <div className="space-y-3 mt-4">
            {toggleItems.map((item) => (
              <Card key={item.key}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-text-primary text-sm">{item.label}</p>
                    <p className="text-xs text-text-secondary">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => toggle(item.key)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${prefs.types[item.key] ? 'bg-primary-muted' : 'bg-border'}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full transition-all ${prefs.types[item.key] ? 'left-6 bg-primary' : 'left-0.5 bg-text-muted'}`} />
                  </button>
                </div>
              </Card>
            ))}

            <Card>
              <p className="font-semibold text-text-primary text-sm mb-2">Daily Reminder Time</p>
              <input
                type="time"
                value={prefs.dailyReminderTime}
                onChange={(e) => setPrefs((p) => ({ ...p, dailyReminderTime: e.target.value }))}
                className="glass-input rounded-xl px-3 py-2 text-sm text-text-primary"
              />
            </Card>
          </div>
        )}

        <Button title="Save Preferences" onPress={handleSave} loading={loading} className="w-full mt-6" />
      </main>
    </div>
  );
}
