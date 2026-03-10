'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { searchJobs, formatSalary, timeAgo, stripHtml } from '@/services/jobSearch';
import { saveJob } from '@/services/firestore';
import { RemoteOKJob } from '@/types';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function JobSearchPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [jobs, setJobs] = useState<RemoteOKJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await searchJobs(query);
      setJobs(results);
      setSearched(true);
    } catch (e: any) {
      alert(e.message || 'Failed to search jobs.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (job: RemoteOKJob) => {
    if (!user) return;
    try {
      await saveJob(user.uid, { source: 'remoteok', externalId: job.id, position: job.position, company: job.company, location: job.location, salaryMin: job.salary_min, salaryMax: job.salary_max, tags: job.tags, applyUrl: job.url, savedAt: Date.now() });
      alert('Job saved!');
    } catch (e: any) {
      alert(e.message || 'Failed to save job.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
      <Navbar />
      <main className="max-w-3xl mx-auto px-5 pt-4 pb-10">
        <PageHeader title="Job Search" subtitle="Search remote job openings" />
        <div className="flex gap-3 mb-6">
          <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} placeholder="Search by title, company, or skill..." className="flex-1 glass-input rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted" />
          <Button title="Search" onPress={handleSearch} loading={loading} className="px-6" />
        </div>

        {searched && jobs.length === 0 && <Card><p className="text-text-secondary text-center">No jobs found. Try a different search term.</p></Card>}

        <div className="space-y-3">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:bg-bg-card-hover transition-colors">
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
          ))}
        </div>
      </main>
    </div>
  );
}
