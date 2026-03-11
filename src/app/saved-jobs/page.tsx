'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getSavedJobs, deleteSavedJob } from '@/services/firestore';
import { formatSalary } from '@/services/jobSearch';
import { SavedJob } from '@/types';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import { PageSkeleton } from '@/components/Skeleton';
import AnimatedPage from '@/components/AnimatedPage';
import EmptyState from '@/components/EmptyState';
import StaggerList, { StaggerItem } from '@/components/StaggerList';

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
      <AnimatedPage>
        <main className="max-w-3xl mx-auto px-5 pt-4 pb-10">
          <PageHeader title="Saved Jobs" subtitle={`${jobs.length} saved`} />
        {loading ? <PageSkeleton />
        : jobs.length === 0 ? <EmptyState icon="💼" title="No Saved Jobs" description="No saved jobs yet." />
        : <StaggerList className="space-y-3">{jobs.map((job) => (
            <StaggerItem key={job.id}>
              <Card>
                <h3 className="text-[15px] font-semibold text-text-primary">{job.position}</h3>
                <p className="text-sm text-text-secondary">{job.company} &middot; {job.location}</p>
                {(job.salaryMin > 0 || job.salaryMax > 0) && <p className="text-sm text-accent mt-1">{formatSalary(job.salaryMin, job.salaryMax)}</p>}
                <div className="flex gap-2 mt-3 justify-end">
                  <button onClick={() => handleDelete(job.id)} className="text-xs text-error hover:underline">Remove</button>
                  <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">Apply &rarr;</a>
                </div>
              </Card>
            </StaggerItem>
          ))}</StaggerList>}
      </main>
      </AnimatedPage>
    </div>
  );
}
