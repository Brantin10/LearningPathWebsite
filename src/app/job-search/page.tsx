'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { searchJobs, formatSalary, timeAgo, stripHtml } from '@/services/jobSearch';
import { saveJob } from '@/services/firestore';
import { RemoteOKJob } from '@/types';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';
import AnimatedPage from '@/components/AnimatedPage';
import StaggerList, { StaggerItem } from '@/components/StaggerList';
import { AnimatePresence, motion } from 'framer-motion';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';

export default function JobSearchPage() {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [jobs, setJobs] = useState<RemoteOKJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'salary'>('newest');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setSelectedTags([]);
    try {
      const results = await searchJobs(query);
      setJobs(results);
      setSearched(true);
    } catch (e: any) {
      toast.error(e.message || 'Failed to search jobs.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (job: RemoteOKJob) => {
    if (!user) return;
    try {
      await saveJob(user.uid, { source: 'remoteok', externalId: job.id, position: job.position, company: job.company, location: job.location, salaryMin: job.salary_min, salaryMax: job.salary_max, tags: job.tags, applyUrl: job.url, savedAt: Date.now() });
      toast.success('Job saved!');
    } catch (e: any) {
      toast.error(e.message || 'Failed to save job.');
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const topTags = useMemo(() => {
    const tagCount: Record<string, number> = {};
    jobs.forEach((job) => {
      job.tags?.forEach((tag) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });
    return Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([tag]) => tag);
  }, [jobs]);

  const filteredAndSortedJobs = useMemo(() => {
    let results = [...jobs];

    if (selectedTags.length > 0) {
      results = results.filter((job) =>
        job.tags?.some((tag) => selectedTags.includes(tag))
      );
    }

    if (sortBy === 'newest') {
      results.sort((a, b) => (b.epoch ?? 0) - (a.epoch ?? 0));
    } else {
      results.sort((a, b) => (b.salary_max ?? 0) - (a.salary_max ?? 0));
    }

    return results;
  }, [jobs, selectedTags, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
      <Navbar />
      <AnimatedPage>
        <main className="max-w-3xl mx-auto px-5 pt-4 pb-10">
          <PageHeader title="Job Search" subtitle="Search remote job openings" />
        <div className="flex gap-3 mb-4">
          <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} placeholder="Search by title, company, or skill..." className="flex-1 glass-input rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted" />
          <Button title="Search" onPress={handleSearch} loading={loading} className="px-6" />
        </div>

        {searched && jobs.length > 0 && (
          <div className="mb-4">
            <button
              onClick={() => setShowFilters((prev) => !prev)}
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors px-3 py-2 glass-card rounded-xl"
            >
              <Filter size={16} />
              <span>Filters</span>
              {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="glass-card rounded-xl p-4 mt-3 space-y-4">
                    {topTags.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">Tags</p>
                        <div className="flex flex-wrap gap-2">
                          {topTags.map((tag) => (
                            <button
                              key={tag}
                              onClick={() => toggleTag(tag)}
                              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                                selectedTags.includes(tag)
                                  ? 'bg-primary text-white'
                                  : 'glass-card text-text-secondary hover:text-text-primary'
                              }`}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">Sort by</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSortBy('newest')}
                          className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                            sortBy === 'newest'
                              ? 'bg-primary text-white'
                              : 'glass-card text-text-secondary hover:text-text-primary'
                          }`}
                        >
                          Newest
                        </button>
                        <button
                          onClick={() => setSortBy('salary')}
                          className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                            sortBy === 'salary'
                              ? 'bg-primary text-white'
                              : 'glass-card text-text-secondary hover:text-text-primary'
                          }`}
                        >
                          Salary ↓
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {searched && (
          <p className="text-sm text-text-secondary mb-3">
            {filteredAndSortedJobs.length} job{filteredAndSortedJobs.length !== 1 ? 's' : ''} found
          </p>
        )}

        {searched && filteredAndSortedJobs.length === 0 && <Card><p className="text-text-secondary text-center">No jobs found. Try a different search term.</p></Card>}

        <StaggerList className="space-y-3">
          {filteredAndSortedJobs.map((job) => (
            <StaggerItem key={job.id}>
              <Card className="hover:bg-bg-card-hover transition-colors">
                <div className="flex items-start gap-3">
                  {job.company_logo && <img src={job.company_logo} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-semibold text-text-primary">{job.position}</h3>
                    <p className="text-sm text-text-secondary">{job.company} &middot; {job.location}</p>
                    {(job.salary_min > 0 || job.salary_max > 0) && <p className="text-sm text-accent font-semibold mt-1">{formatSalary(job.salary_min, job.salary_max)}</p>}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {job.tags?.slice(0, 4).map((tag) => <span key={tag} className="text-[10px] bg-bg-card-hover text-text-secondary px-2 py-0.5 rounded-full">{tag}</span>)}
                    </div>
                    <p className="text-xs text-text-muted mt-2">{timeAgo(job.epoch)}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 justify-end">
                  <button onClick={() => handleSave(job)} className="text-xs text-accent hover:underline">Save</button>
                  <a href={job.url} target="_blank" rel="noopener noreferrer" className="text-xs bg-primary text-white px-3 py-1 rounded-full hover:bg-primary-dark transition-colors">Apply &rarr;</a>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </StaggerList>
      </main>
      </AnimatedPage>
    </div>
  );
}
