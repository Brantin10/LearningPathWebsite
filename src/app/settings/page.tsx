'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { useTheme } from '@/hooks/useTheme';
import { logOut } from '@/services/auth';
import { updateUser } from '@/services/firestore';
import { setLPApiBaseUrl, getLPApiBaseUrl } from '@/config/api';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import PageHeader from '@/components/PageHeader';

function SettingLink({ icon, title, desc, onPress }: { icon: string; title: string; desc: string; onPress: () => void }) {
  return (
    <button onClick={onPress} className="w-full flex items-center glass-card rounded-2xl p-4 mb-3 text-left hover:bg-bg-card-hover transition-colors">
      <span className="text-2xl mr-3">{icon}</span>
      <div className="flex-1">
        <p className="text-[15px] font-semibold text-text-primary">{title}</p>
        <p className="text-[11px] text-text-secondary mt-0.5">{desc}</p>
      </div>
      <span className="text-text-muted text-lg ml-2">&rarr;</span>
    </button>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile } = useUser();
  const { isDark, toggleTheme } = useTheme();
  const isSeeker = !profile?.role || profile.role === 'seeker';
  const [lpUrl, setLpUrl] = React.useState('');

  React.useEffect(() => {
    setLpUrl(getLPApiBaseUrl());
  }, []);

  const handleLogout = async () => {
    if (confirm('Are you sure you want to log out?')) {
      await logOut();
      router.replace('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
      <Navbar />
      <main className="max-w-2xl mx-auto px-5 pt-4 pb-10">
        <PageHeader title="Settings" subtitle="Manage your account and preferences" />

        {/* Appearance */}
        <h2 className="text-lg font-semibold text-text-primary mt-5 mb-3">Appearance</h2>
        <Card className="mb-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[15px] font-semibold text-text-primary">{isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}</p>
              <p className="text-sm text-text-secondary">Switch between dark and light themes</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-12 h-6 rounded-full transition-colors relative ${isDark ? 'bg-primary-muted' : 'bg-border'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full transition-all ${isDark ? 'left-6 bg-primary' : 'left-0.5 bg-text-muted'}`} />
            </button>
          </div>
        </Card>

        {/* Account */}
        <h2 className="text-lg font-semibold text-text-primary mt-5 mb-3">Account</h2>
        <SettingLink icon="👤" title="Edit Profile" desc="Update your skills, education and experience" onPress={() => router.push('/profile-setup')} />
        <SettingLink icon="🎨" title="Change Avatar" desc="Pick a new profile picture" onPress={() => router.push('/avatar')} />

        {/* Notifications */}
        <h2 className="text-lg font-semibold text-text-primary mt-5 mb-3">Notifications</h2>
        <SettingLink icon="🔔" title="Notification Preferences" desc="Reminders, streak alerts and weekly summaries" onPress={() => router.push('/notification-settings')} />

        {/* LP API Configuration */}
        <h2 className="text-lg font-semibold text-text-primary mt-5 mb-3">Learning Path API</h2>
        <Card className="mb-3">
          <p className="text-sm text-text-secondary mb-2">Server URL for AI learning path generation</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={lpUrl}
              onChange={(e) => setLpUrl(e.target.value)}
              className="flex-1 glass-input rounded-xl px-3 py-2 text-sm text-text-primary"
              placeholder="http://localhost:8000"
            />
            <button
              onClick={() => { setLPApiBaseUrl(lpUrl); alert('LP API URL saved!'); }}
              className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors"
            >
              Save
            </button>
          </div>
        </Card>

        {/* Privacy */}
        {isSeeker && (
          <>
            <h2 className="text-lg font-semibold text-text-primary mt-5 mb-3">Privacy</h2>
            <Card className="mb-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[15px] font-semibold text-text-primary">Visible to Employers</p>
                  <p className="text-sm text-text-secondary">Allow employers to discover your profile</p>
                </div>
                <button
                  onClick={async () => {
                    if (!user) return;
                    await updateUser(user.uid, { visibleToEmployers: !(profile?.visibleToEmployers ?? false) });
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative ${profile?.visibleToEmployers ? 'bg-primary-muted' : 'bg-border'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full transition-all ${profile?.visibleToEmployers ? 'left-6 bg-primary' : 'left-0.5 bg-text-muted'}`} />
                </button>
              </div>
            </Card>
          </>
        )}

        {/* About */}
        <h2 className="text-lg font-semibold text-text-primary mt-5 mb-3">About</h2>
        <SettingLink icon="❓" title="How to Get Started" desc="Step-by-step guide for using the app" onPress={() => router.push('/guide')} />

        {/* Account Info */}
        <Card className="mt-5">
          <p className="text-[11px] uppercase tracking-wider text-text-muted mb-1">Signed in as</p>
          <p className="text-[15px] text-text-primary mb-4">{profile?.email || user?.email || 'Unknown'}</p>
          <p className="text-[11px] uppercase tracking-wider text-text-muted mb-1">Role</p>
          <p className="text-[15px] text-text-primary">{isSeeker ? 'Job Seeker' : 'Employer'}</p>
        </Card>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mx-auto block mt-6 px-6 py-3 rounded-2xl bg-error-muted border border-[rgba(255,107,107,0.4)] text-error font-semibold hover:bg-[rgba(255,107,107,0.25)] transition-colors"
        >
          Log Out
        </button>
      </main>
    </div>
  );
}
