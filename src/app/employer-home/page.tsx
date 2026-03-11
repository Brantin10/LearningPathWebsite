'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { useTheme } from '@/hooks/useTheme';
import { getEmployerBookmarks, getOutgoingRequests, getConversations } from '@/services/firestore';
import { logOut } from '@/services/auth';
import { motion } from 'framer-motion';
import Avatar from '@/components/Avatar';
import Navbar from '@/components/Navbar';
import { PageSkeleton } from '@/components/Skeleton';
import AnimatedPage from '@/components/AnimatedPage';
import { Search, Bookmark, Inbox, User, Users, Settings, LogOut, HelpCircle } from 'lucide-react';

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onPress: () => void;
}

function ActionCard({ title, description, icon, onPress }: ActionCardProps) {
  return (
    <motion.button
      onClick={onPress}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="glass-card-interactive cursor-pointer rounded-2xl p-4 text-left min-h-[120px] flex flex-col justify-between group"
    >
      <div>
        <div className="text-primary mb-2">{icon}</div>
        <h3 className="text-[17px] font-semibold text-text-primary mb-1">{title}</h3>
        <p className="text-[11px] text-text-secondary leading-4">{description}</p>
      </div>
      <span className="text-text-muted self-end text-lg group-hover:text-primary transition-colors">&rarr;</span>
    </motion.button>
  );
}

export default function EmployerHomePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUser();
  const { colors } = useTheme();

  const [savedCount, setSavedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [chatsCount, setChatsCount] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);

  const username = profile?.username || user?.email?.split('@')[0] || 'Employer';
  const avatarIndex = profile?.avatar ?? 0;

  useEffect(() => {
    if (!user) return;

    async function loadStats() {
      try {
        const [bookmarks, requests, conversations] = await Promise.all([
          getEmployerBookmarks(user!.uid),
          getOutgoingRequests(user!.uid),
          getConversations(user!.uid),
        ]);
        setSavedCount(bookmarks.length);
        setPendingCount(requests.filter((r) => r.status === 'pending').length);
        setChatsCount(conversations.length);
      } catch (err) {
        console.error('Failed to load employer stats:', err);
      } finally {
        setStatsLoading(false);
      }
    }

    loadStats();
  }, [user]);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      await logOut();
      router.replace('/');
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
        <PageSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
      <Navbar />
      <AnimatedPage>
        <main className="max-w-6xl mx-auto px-5 pt-4 pb-10">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button onClick={() => router.push('/avatar')}>
            <Avatar index={avatarIndex} size={56} />
          </button>
          <div className="ml-4 flex-1">
            <h1 className="text-2xl font-bold text-text-primary">{username}</h1>
            <p className="text-sm text-text-secondary">
              {profile?.currentJob || 'Employer Dashboard'}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-muted text-primary border border-[rgba(39,174,96,0.4)]">
            Employer
          </span>
        </div>

        {/* Stats Card */}
        <div className="glass-card rounded-2xl p-5 mb-5">
          <div className="grid grid-cols-3 divide-x divide-border">
            <button
              onClick={() => router.push('/employer-saved')}
              className="flex flex-col items-center py-2 hover:opacity-80 transition-opacity"
            >
              <span className="text-2xl font-bold text-accent">
                {statsLoading ? '-' : savedCount}
              </span>
              <span className="text-[11px] text-text-secondary mt-1 uppercase tracking-wider">Saved</span>
            </button>
            <button
              onClick={() => router.push('/inbox')}
              className="flex flex-col items-center py-2 hover:opacity-80 transition-opacity"
            >
              <span className="text-2xl font-bold text-accent">
                {statsLoading ? '-' : pendingCount}
              </span>
              <span className="text-[11px] text-text-secondary mt-1 uppercase tracking-wider">Pending</span>
            </button>
            <button
              onClick={() => router.push('/inbox')}
              className="flex flex-col items-center py-2 hover:opacity-80 transition-opacity"
            >
              <span className="text-2xl font-bold text-accent">
                {statsLoading ? '-' : chatsCount}
              </span>
              <span className="text-[11px] text-text-secondary mt-1 uppercase tracking-wider">Chats</span>
            </button>
          </div>
        </div>

        {/* Guide Button */}
        <button
          onClick={() => router.push('/guide')}
          className="w-full flex items-center bg-primary-muted border border-[rgba(39,174,96,0.4)] rounded-2xl py-4 px-5 mb-5 hover:bg-[rgba(39,174,96,0.25)] transition-colors"
        >
          <HelpCircle size={20} className="text-primary mr-3" />
          <span className="flex-1 text-[15px] font-semibold text-primary text-left">How to Get Started</span>
          <span className="text-primary text-lg">&rarr;</span>
        </button>

        {/* Action Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <ActionCard
            title="Browse Candidates"
            description="Discover talent matching your needs"
            icon={<Search size={22} />}
            onPress={() => router.push('/employer-browse')}
          />
          <ActionCard
            title="Saved Candidates"
            description="View your bookmarked talent"
            icon={<Bookmark size={22} />}
            onPress={() => router.push('/employer-saved')}
          />
          <ActionCard
            title="Inbox"
            description="Messages and contact requests"
            icon={<Inbox size={22} />}
            onPress={() => router.push('/inbox')}
          />
          <ActionCard
            title="My Profile"
            description="Edit your company information"
            icon={<User size={22} />}
            onPress={() => router.push('/profile-setup')}
          />
          <ActionCard
            title="Community"
            description="Engage with career changers"
            icon={<Users size={22} />}
            onPress={() => router.push('/community')}
          />
          <ActionCard
            title="Settings"
            description="Account and preferences"
            icon={<Settings size={22} />}
            onPress={() => router.push('/settings')}
          />
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mx-auto flex items-center gap-2 mt-8 px-6 py-3 rounded-2xl bg-error-muted border border-[rgba(255,107,107,0.4)] text-error font-semibold hover:bg-[rgba(255,107,107,0.25)] transition-colors"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </main>
      </AnimatedPage>
    </div>
  );
}
