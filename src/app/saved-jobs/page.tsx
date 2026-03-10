'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getSavedJobs, deleteSavedJob } from '@/services/firestore';
import { formatSalary } from '@/services/jobSearch';
import { SavedJob } from '@/types';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';

export default function SavedJobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) getSavedJobs(user.uid).then((j) => { setJobs(j); setLoading(false); }); }, [user]);

  const handleDelete = async (jobId: string) => {
    if (!user) return;
    await deleteSavedJob(user.uid, jobId);
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
      <Navbar />
      <main className="max-w-3xl mx-auto px-5 pt-4 pb-10">
        <PageHeader title="Saved Jobs" subtitle={`${jobs.length} saved`} />
        {loading ? <div className="flex justify-center py-20"><div className="flex gap-1"><span className="typing-dot w-3 h-3 rounded-full bg-primary" /><span className="typing-dot w-3 h-3 rounded-full bg-primary" /><span className="typing-dot w-3 h-3 rounded-full bg-primary" /></div></div>
        : jobs.length === 0 ? <Card><p className="text-text-secondary text-center">No saved jobs yet.</p></Card>
        : <div className="space-y-3">{jobs.map((job) => (
            <Card key={job.id}>
              <h3 className="text-[15px] font-semibold text-text-primary">{job.position}</h3>
              <p className="text-sm text-text-secondary">{job.company} &middot; {job.location}</p>
              {(job.salaryMin > 0 || job.salaryMax > 0) && <p className="text-sm text-accent mt-1">{formatSalary(job.salaryMin, job.salaryMax)}</p>}
              <div className="flex gap-2 mt-3 justify-end">
                <button onClick={() => handleDelete(job.id)} className="text-xs text-error hover:underline">Remove</button>
                <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">Apply &rarr;</a>
              </div>
            </Card>
          ))}</div>}
      </main>
    </div>
  );
}
