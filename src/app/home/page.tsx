'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import Navbar from '@/components/Navbar';
import Avatar from '@/components/Avatar';
import AnimatedPage from '@/components/AnimatedPage';
import StaggerList, { StaggerItem } from '@/components/StaggerList';
import { motion } from 'framer-motion';
import { Sparkles, ListChecks, HelpCircle, Search, Briefcase, User, FileText, Globe, MessageSquare, BarChart3, BookOpen, TrendingUp, Users, MessagesSquare, Brain, Inbox, Settings, Zap } from 'lucide-react';

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

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile } = useUser();

  const username = profile?.username || user?.email?.split('@')[0] || 'User';
  const avatarIndex = profile?.avatar ?? 0;
  const hasCareer = !!profile?.chosenCareer;

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
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-text-primary">{username}</h1>
            <p className="text-sm text-text-secondary">
              {profile?.currentJob || 'Set up your profile to get started'}
            </p>
          </div>
        </div>

        {/* Guide Button */}
        <button
          onClick={() => router.push('/guide')}
          className="w-full flex items-center bg-primary-muted border border-[rgba(39,174,96,0.4)] rounded-2xl py-4 px-5 mb-5 hover:bg-[rgba(39,174,96,0.25)] transition-colors"
        >
          <span className="text-lg mr-3">&#10067;</span>
          <span className="flex-1 text-[15px] font-semibold text-primary text-left">How to Get Started</span>
          <span className="text-primary text-lg">&rarr;</span>
        </button>

        {/* Action Grid */}
        <StaggerList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <StaggerItem><ActionCard title="AI Coach" description="Get personalized career advice" icon={<Sparkles size={24} />} onPress={() => router.push('/ai-chat')} /></StaggerItem>
          <StaggerItem><ActionCard title="Daily Actions" description="Your personalized daily to-dos" icon={<ListChecks size={24} />} onPress={() => router.push('/daily-actions')} /></StaggerItem>
          <StaggerItem><ActionCard title="Career Quiz" description="Answer questions to find your match" icon={<HelpCircle size={24} />} onPress={() => router.push('/questionnaire')} /></StaggerItem>
          <StaggerItem><ActionCard title="Find Careers" description="Discover your top career matches" icon={<Search size={24} />} onPress={() => router.push('/career-match')} /></StaggerItem>
          {hasCareer && (
            <StaggerItem><ActionCard title="My Career" description="View your career path and progress" icon={<Briefcase size={24} />} onPress={() => router.push('/career-manager')} /></StaggerItem>
          )}
          <StaggerItem><ActionCard title="Profile" description="Edit your skills and experience" icon={<User size={24} />} onPress={() => router.push('/profile-setup')} /></StaggerItem>
          <StaggerItem><ActionCard title="Resume" description="Build and share your CV" icon={<FileText size={24} />} onPress={() => router.push('/cv')} /></StaggerItem>
          <StaggerItem><ActionCard title="Job Search" description="Find remote job openings" icon={<Globe size={24} />} onPress={() => router.push('/job-search')} /></StaggerItem>
          <StaggerItem><ActionCard title="Interview Prep" description="Practice with STAR method" icon={<MessageSquare size={24} />} onPress={() => router.push('/interview-prep')} /></StaggerItem>
          <StaggerItem><ActionCard title="Applications" description="Track your job applications" icon={<BarChart3 size={24} />} onPress={() => router.push('/application-tracker')} /></StaggerItem>
          <StaggerItem><ActionCard title="Progress" description="Track streaks, badges and progress" icon={<TrendingUp size={24} />} onPress={() => router.push('/progress')} /></StaggerItem>
          {hasCareer && (
            <StaggerItem><ActionCard title="My Journey" description="Your before & after progress story" icon={<BookOpen size={24} />} onPress={() => router.push('/progress-story')} /></StaggerItem>
          )}
          <StaggerItem><ActionCard title="Skills Gap" description="Analyze your skills vs career" icon={<Zap size={24} />} onPress={() => router.push('/skills-gap')} /></StaggerItem>
          <StaggerItem><ActionCard title="Salary Insights" description="See salary ranges for your career" icon={<TrendingUp size={24} />} onPress={() => router.push('/salary-insights')} /></StaggerItem>
          <StaggerItem><ActionCard title="Networking" description="Communities, mentors and tips" icon={<Users size={24} />} onPress={() => router.push('/networking')} /></StaggerItem>
          <StaggerItem><ActionCard title="Community" description="Discuss with other career changers" icon={<MessagesSquare size={24} />} onPress={() => router.push('/community')} /></StaggerItem>
          <StaggerItem><ActionCard title="Inbox" description="Messages and contact requests" icon={<Inbox size={24} />} onPress={() => router.push('/inbox')} /></StaggerItem>
          <StaggerItem><ActionCard title="Skill Quiz" description="Test your knowledge with quick quizzes" icon={<Brain size={24} />} onPress={() => router.push('/skill-quiz')} /></StaggerItem>
          <StaggerItem><ActionCard title="Settings" description="Privacy, notifications & account" icon={<Settings size={24} />} onPress={() => router.push('/settings')} /></StaggerItem>
        </StaggerList>
      </main>
      </AnimatedPage>
    </div>
  );
}
