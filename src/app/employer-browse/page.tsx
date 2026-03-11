'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { useTheme } from '@/hooks/useTheme';
import { getVisibleSeekers, getAllCareers } from '@/services/firestore';
import Avatar from '@/components/Avatar';
import PageHeader from '@/components/PageHeader';
import Navbar from '@/components/Navbar';
import { PageSkeleton } from '@/components/Skeleton';
import AnimatedPage from '@/components/AnimatedPage';
import StaggerList, { StaggerItem } from '@/components/StaggerList';
import { Search, ChevronRight } from 'lucide-react';
import { CandidateListItem, Career } from '@/types';

export default function EmployerBrowsePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { profile } = useUser();
  const { colors } = useTheme();

  const [candidates, setCandidates] = useState<CandidateListItem[]>([]);
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    async function load() {
      try {
        const [seekers, allCareers] = await Promise.all([
          getVisibleSeekers(),
          getAllCareers(),
        ]);
        setCandidates(seekers);
        setCareers(allCareers);
      } catch (err) {
        console.error('Failed to load candidates:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Extract unique categories from careers
  const categories = useMemo(() => {
    const cats = new Set(careers.map((c) => c.category).filter(Boolean));
    return ['All', ...Array.from(cats).sort()];
  }, [careers]);

  // Build a career uid -> name lookup
  const careerNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    careers.forEach((c) => {
      map[c.uid] = c.name;
    });
    return map;
  }, [careers]);

  // Build career uid -> category lookup
  const careerCategoryMap = useMemo(() => {
    const map: Record<string, string> = {};
    careers.forEach((c) => {
      map[c.uid] = c.category;
    });
    return map;
  }, [careers]);

  // Filter candidates
  const filtered = useMemo(() => {
    let result = candidates;

    if (selectedCategory !== 'All') {
      result = result.filter((c) => careerCategoryMap[c.chosenCareer] === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.username.toLowerCase().includes(q) ||
          c.skills.toLowerCase().includes(q) ||
          c.currentJob.toLowerCase().includes(q) ||
          (careerNameMap[c.chosenCareer] || '').toLowerCase().includes(q)
      );
    }

    return result;
  }, [candidates, selectedCategory, searchQuery, careerNameMap, careerCategoryMap]);

  if (authLoading || loading) {
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
        <main className="max-w-4xl mx-auto px-5 pt-4 pb-10">
          <PageHeader title="Browse Candidates" subtitle="DISCOVER" />

        {/* Search Input */}
        <div className="relative mb-4">
          <Search size={24} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, skills, or career..."
            className="w-full glass-input rounded-2xl pl-11 pr-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
                selectedCategory === cat
                  ? 'bg-primary text-white border-primary'
                  : 'bg-transparent text-text-secondary border-border-light hover:border-primary hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p className="text-sm text-text-secondary mb-4">
          {filtered.length} candidate{filtered.length !== 1 ? 's' : ''} found
        </p>

        {/* Candidate Cards */}
        {filtered.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 text-center">
            <p className="text-4xl mb-3">&#128373;</p>
            <p className="text-lg font-semibold text-text-primary mb-2">No candidates found</p>
            <p className="text-sm text-text-secondary">
              Try adjusting your search or category filter. Only candidates who have enabled employer visibility will appear here.
            </p>
          </div>
        ) : (
          <StaggerList className="space-y-3">
            {filtered.map((candidate) => {
              const careerName = careerNameMap[candidate.chosenCareer] || 'Exploring';
              const skillsArray = candidate.skills
                ? candidate.skills.split(',').map((s) => s.trim()).filter(Boolean)
                : [];

              return (
                <StaggerItem key={candidate.uid}>
                  <button
                    onClick={() => router.push(`/employer-candidate?candidateUid=${candidate.uid}`)}
                    className="w-full glass-card rounded-2xl p-4 text-left hover:bg-bg-card-hover transition-colors flex items-center gap-4"
                  >
                    <Avatar index={candidate.avatar} size={48} />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[15px] font-semibold text-text-primary truncate">
                        {candidate.username}
                      </h3>
                      {candidate.currentJob && (
                        <p className="text-[12px] text-text-secondary truncate">
                          {candidate.currentJob}
                        </p>
                      )}
                      <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent-muted text-accent border border-[rgba(100,255,218,0.3)]">
                        {careerName}
                      </span>
                      {skillsArray.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {skillsArray.slice(0, 4).map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary-muted text-primary border border-[rgba(39,174,96,0.3)]"
                            >
                              {skill}
                            </span>
                          ))}
                          {skillsArray.length > 4 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium text-text-muted">
                              +{skillsArray.length - 4} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <ChevronRight size={24} className="text-text-muted flex-shrink-0" />
                  </button>
                </StaggerItem>
              );
            })}
          </StaggerList>
        )}
      </main>
      </AnimatedPage>
    </div>
  );
}
