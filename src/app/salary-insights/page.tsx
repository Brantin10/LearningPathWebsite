'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import { getCareer, getSavedJobs } from '@/services/firestore';
import { getSalaryData, formatSalaryAmount, formatSalaryRange } from '@/data/salaryData';
import { CareerSalaryData, Career, SavedJob, SalaryRange } from '@/types';

export default function SalaryInsightsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUser();

  const [career, setCareer] = useState<Career | null>(null);
  const [salaryData, setSalaryData] = useState<CareerSalaryData | null>(null);
  const [savedJobsAvg, setSavedJobsAvg] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || profileLoading) return;
    if (!user) { router.replace('/login'); return; }
    if (!profile?.chosenCareer) { setLoading(false); return; }

    const load = async () => {
      try {
        const [c, jobs] = await Promise.all([
          getCareer(profile.chosenCareer),
          getSavedJobs(user.uid),
        ]);

        setCareer(c);

        if (c) {
          const data = getSalaryData(c.name);
          setSalaryData(data);
        }

        // Calculate average salary from saved jobs
        if (jobs.length > 0) {
          const salaries = jobs
            .filter((j: SavedJob) => j.salaryMin > 0 || j.salaryMax > 0)
            .map((j: SavedJob) => {
              if (j.salaryMin > 0 && j.salaryMax > 0) return (j.salaryMin + j.salaryMax) / 2;
              return j.salaryMin || j.salaryMax;
            });
          if (salaries.length > 0) {
            const avg = Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length);
            setSavedJobsAvg(avg);
          }
        }
      } catch (err) {
        console.error('Failed to load salary data:', err);
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
          <PageHeader title="Salary Insights" subtitle="Loading..." />
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
          <PageHeader title="Salary Insights" subtitle="Salary data for your career" />
          <div className="glass-card rounded-2xl p-8 text-center mt-8">
            <p className="text-5xl mb-4">💰</p>
            <h2 className="text-xl font-bold text-text-primary mb-2">No Career Selected</h2>
            <p className="text-text-secondary text-sm mb-6">
              Choose a career path to see salary ranges and insights for your target role.
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

  if (!salaryData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
        <Navbar />
        <main className="max-w-2xl mx-auto px-5 pt-4 pb-10">
          <PageHeader title="Salary Insights" subtitle={career?.name || 'Salary data'} />
          <div className="glass-card rounded-2xl p-8 text-center mt-8">
            <p className="text-5xl mb-4">📊</p>
            <h2 className="text-xl font-bold text-text-primary mb-2">No Salary Data Available</h2>
            <p className="text-text-secondary text-sm">
              Salary information is not yet available for &quot;{career?.name}&quot;. Check back later as we expand our database.
            </p>
          </div>
        </main>
      </div>
    );
  }

  const overallMin = salaryData.entryLevel.min;
  const overallMax = salaryData.seniorLevel.max;

  const levels: { label: string; range: SalaryRange; color: string }[] = [
    { label: 'Entry Level', range: salaryData.entryLevel, color: '#64ffda' },
    { label: 'Mid Level', range: salaryData.midLevel, color: '#ffd93d' },
    { label: 'Senior Level', range: salaryData.seniorLevel, color: '#ff6b6b' },
  ];

  const negotiationTips = [
    'Research the market rate for your specific role and location before negotiations.',
    'Always negotiate based on the value you bring, not your current salary.',
    'Consider the full compensation package: benefits, equity, bonuses, and flexibility.',
    'Practice your negotiation pitch with a friend or mentor before the real conversation.',
    'Be prepared to walk away if the offer does not meet your minimum requirements.',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
      <Navbar />
      <main className="max-w-2xl mx-auto px-5 pt-4 pb-10">
        <PageHeader title="Salary Insights" subtitle={salaryData.careerName} />

        {/* Hero Card */}
        <div className="glass-card-elevated rounded-2xl p-6 mb-5 text-center">
          <p className="text-[10px] uppercase tracking-widest text-text-muted mb-2">
            Full Salary Range
          </p>
          <p className="text-3xl font-bold gradient-text">
            {formatSalaryRange(overallMin, overallMax)}
          </p>
          <p className="text-sm text-text-secondary mt-2">{salaryData.careerName}</p>
        </div>

        {/* Salary Bars by Level */}
        <div className="glass-card rounded-2xl p-5 mb-4">
          <h3 className="text-lg font-semibold text-text-primary mb-4">By Experience Level</h3>
          <div className="space-y-5">
            {levels.map((level) => {
              const barPercent = overallMax > 0
                ? Math.round((level.range.max / overallMax) * 100)
                : 0;

              return (
                <div key={level.label}>
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-sm font-medium text-text-primary">{level.label}</span>
                    <span className="text-xs text-text-secondary">
                      {formatSalaryRange(level.range.min, level.range.max)}
                    </span>
                  </div>
                  <div className="bg-border rounded-full overflow-hidden h-3">
                    <div
                      className="h-3 rounded-full transition-all duration-700"
                      style={{
                        width: `${barPercent}%`,
                        backgroundColor: level.color,
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-text-muted mt-1">
                    Median: {formatSalaryAmount(level.range.median)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Median Values Table */}
        <div className="glass-card rounded-2xl p-5 mb-4">
          <h3 className="text-lg font-semibold text-text-primary mb-3">Median Salaries</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-text-muted font-medium">Level</th>
                  <th className="text-center py-2 text-text-muted font-medium">Min</th>
                  <th className="text-center py-2 text-text-muted font-medium">Median</th>
                  <th className="text-center py-2 text-text-muted font-medium">Max</th>
                </tr>
              </thead>
              <tbody>
                {levels.map((level) => (
                  <tr key={level.label} className="border-b border-border last:border-b-0">
                    <td className="py-2.5 text-text-secondary">{level.label}</td>
                    <td className="text-center text-text-primary">{formatSalaryAmount(level.range.min)}</td>
                    <td className="text-center font-semibold" style={{ color: level.color }}>
                      {formatSalaryAmount(level.range.median)}
                    </td>
                    <td className="text-center text-text-primary">{formatSalaryAmount(level.range.max)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Career Growth Rate */}
        <div className="glass-card rounded-2xl p-5 mb-4">
          <h3 className="text-lg font-semibold text-text-primary mb-2">Career Growth Rate</h3>
          <div className="flex items-center gap-3">
            <span className="text-3xl">📈</span>
            <div>
              <p className="text-lg font-bold text-accent">{salaryData.growthRate}</p>
              <p className="text-xs text-text-secondary">Projected employment growth</p>
            </div>
          </div>
        </div>

        {/* Saved Jobs Average */}
        {savedJobsAvg !== null && (
          <div className="glass-card rounded-2xl p-5 mb-4">
            <h3 className="text-lg font-semibold text-text-primary mb-2">Your Saved Jobs</h3>
            <div className="flex items-center gap-3">
              <span className="text-3xl">⭐</span>
              <div>
                <p className="text-lg font-bold text-accent">
                  {formatSalaryAmount(savedJobsAvg)}/yr avg
                </p>
                <p className="text-xs text-text-secondary">
                  Average salary from your saved job listings
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Negotiation Tips */}
        <div className="glass-card rounded-2xl p-5 mb-4">
          <h3 className="text-lg font-semibold text-text-primary mb-3">Negotiation Tips</h3>
          <div className="space-y-3">
            {negotiationTips.map((tip, idx) => (
              <div key={idx} className="flex gap-3">
                <span className="text-primary font-bold text-sm flex-shrink-0">
                  {idx + 1}.
                </span>
                <p className="text-sm text-text-secondary leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Source Attribution */}
        <div className="text-center mt-4">
          <p className="text-[10px] text-text-muted">
            Source: {salaryData.source}
          </p>
          <p className="text-[10px] text-text-muted mt-0.5">
            Salary figures are approximate and may vary by location, company, and experience.
          </p>
        </div>
      </main>
    </div>
  );
}
