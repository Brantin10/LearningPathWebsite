'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import { getCareer } from '@/services/firestore';
import { analyzeSkillsGap } from '@/utils/skillsMatcher';
import { SkillsGapAnalysis, Career } from '@/types';

export default function SkillsGapPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUser();

  const [career, setCareer] = useState<Career | null>(null);
  const [analysis, setAnalysis] = useState<SkillsGapAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || profileLoading) return;
    if (!user) { router.replace('/login'); return; }
    if (!profile?.chosenCareer) { setLoading(false); return; }

    const load = async () => {
      try {
        const c = await getCareer(profile.chosenCareer);
        setCareer(c);

        if (c && profile.skills) {
          const gap = analyzeSkillsGap(profile.skills, c.skills || [], c.skillsURL || []);
          setAnalysis(gap);
        }
      } catch (err) {
        console.error('Failed to load skills gap:', err);
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
          <PageHeader title="Skills Gap" subtitle="Loading..." />
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </main>
      </div>
    );
  }

  // No career selected
  if (!profile?.chosenCareer) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
        <Navbar />
        <main className="max-w-2xl mx-auto px-5 pt-4 pb-10">
          <PageHeader title="Skills Gap" subtitle="Analyze your skills" />
          <div className="glass-card rounded-2xl p-8 text-center mt-8">
            <p className="text-5xl mb-4">🎯</p>
            <h2 className="text-xl font-bold text-text-primary mb-2">No Career Selected</h2>
            <p className="text-text-secondary text-sm mb-6">
              Choose a career path first to analyze your skills gap.
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

  // No skills entered
  if (!profile?.skills || !profile.skills.trim()) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
        <Navbar />
        <main className="max-w-2xl mx-auto px-5 pt-4 pb-10">
          <PageHeader title="Skills Gap" subtitle={career?.name || 'Analyze your skills'} />
          <div className="glass-card rounded-2xl p-8 text-center mt-8">
            <p className="text-5xl mb-4">📝</p>
            <h2 className="text-xl font-bold text-text-primary mb-2">No Skills Listed</h2>
            <p className="text-text-secondary text-sm mb-6">
              Add your skills in your profile so we can compare them against your target career.
            </p>
            <button
              onClick={() => router.push('/profile-setup')}
              className="bg-primary text-white px-6 py-3 rounded-2xl font-semibold hover:bg-primary-dark transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!analysis) return null;

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return { bg: 'bg-error-muted', text: 'text-error', border: 'border-[rgba(255,107,107,0.4)]' };
      case 'medium': return { bg: 'bg-[rgba(255,217,61,0.15)]', text: 'text-warning', border: 'border-[rgba(255,217,61,0.4)]' };
      case 'low': return { bg: 'bg-primary-muted', text: 'text-primary', border: 'border-[rgba(39,174,96,0.4)]' };
    }
  };

  // Sort missing skills by priority
  const sortedMissing = [...analysis.missingSkills].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
      <Navbar />
      <main className="max-w-2xl mx-auto px-5 pt-4 pb-10">
        <PageHeader title="Skills Gap" subtitle={career?.name || 'Analyze your skills'} />

        {/* Match Score */}
        <div className="glass-card-elevated rounded-2xl p-6 mb-5 text-center">
          <p className="text-[10px] uppercase tracking-widest text-text-muted mb-2">Skills Match</p>
          <p
            className={`text-6xl font-bold ${
              analysis.matchPercentage >= 70
                ? 'text-primary'
                : analysis.matchPercentage >= 40
                  ? 'text-warning'
                  : 'text-error'
            }`}
          >
            {analysis.matchPercentage}%
          </p>
          <p className="text-sm text-text-secondary mt-2">
            {analysis.matchedSkills.length} of {analysis.totalRequired} skills matched
          </p>
        </div>

        {/* Matched Skills */}
        {analysis.matchedSkills.length > 0 && (
          <div className="glass-card rounded-2xl p-5 mb-4">
            <h3 className="text-lg font-semibold text-text-primary mb-3">
              Matched Skills ({analysis.matchedSkills.length})
            </h3>
            <div className="space-y-2">
              {analysis.matchedSkills.map((skill) => (
                <div
                  key={skill.skill}
                  className="flex items-center gap-3 py-2 border-b border-border last:border-b-0"
                >
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary">{skill.skill}</p>
                    {skill.userSkill && skill.userSkill.toLowerCase() !== skill.skill.toLowerCase() && (
                      <p className="text-[10px] text-text-muted">
                        Matched via: {skill.userSkill}
                      </p>
                    )}
                  </div>
                  {skill.status === 'partial' && (
                    <span className="text-[10px] font-bold text-warning bg-[rgba(255,217,61,0.15)] px-2 py-0.5 rounded-full">
                      PARTIAL
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Missing Skills */}
        {sortedMissing.length > 0 && (
          <div className="glass-card rounded-2xl p-5 mb-4">
            <h3 className="text-lg font-semibold text-text-primary mb-3">
              Missing Skills ({sortedMissing.length})
            </h3>
            <div className="space-y-2">
              {sortedMissing.map((skill) => {
                const colors = getPriorityColor(skill.priority);
                return (
                  <div
                    key={skill.skill}
                    className="flex items-center gap-3 py-2 border-b border-border last:border-b-0"
                  >
                    <div className="w-5 h-5 rounded-full bg-border flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-primary">{skill.skill}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}
                    >
                      {skill.priority}
                    </span>
                    {skill.learnUrl && (
                      <a
                        href={skill.learnUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent text-xs font-semibold hover:underline flex-shrink-0"
                      >
                        Learn &rarr;
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* All matched state */}
        {sortedMissing.length === 0 && analysis.matchedSkills.length > 0 && (
          <div className="glass-card rounded-2xl p-6 text-center">
            <p className="text-4xl mb-2">🎉</p>
            <h3 className="text-lg font-bold text-text-primary mb-1">Perfect Match!</h3>
            <p className="text-sm text-text-secondary">
              You have all the skills needed for this career path. Keep improving and stay sharp!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
