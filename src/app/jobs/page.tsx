'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { getCareer } from '@/services/firestore';
import { Career } from '@/types';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';

export default function JobsPage() {
  const { profile } = useUser();
  const [career, setCareer] = useState<Career | null>(null);

  useEffect(() => { if (profile?.chosenCareer) getCareer(profile.chosenCareer).then(setCareer); }, [profile?.chosenCareer]);

  const jobs: { title: string; desc: string; url: string }[] = [];
  if (career?.matchingJobs) {
    for (let i = 0; i < career.matchingJobs.length; i += 3) {
      jobs.push({ title: career.matchingJobs[i], desc: career.matchingJobs[i + 1], url: career.matchingJobs[i + 2] });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
      <Navbar />
      <main className="max-w-2xl mx-auto px-5 pt-4 pb-10">
        <PageHeader title="Related Jobs" subtitle={career?.name || 'Jobs for your career'} />
        {jobs.length === 0 ? <Card><p className="text-text-secondary">No related jobs available.</p></Card>
        : <div className="space-y-3">{jobs.map((job, i) => (
            <Card key={i}>
              <h3 className="text-[15px] font-semibold text-text-primary">{job.title}</h3>
              <p className="text-sm text-text-secondary mt-1">{job.desc}</p>
              {job.url && <a href={job.url} target="_blank" rel="noopener noreferrer" className="text-accent text-sm hover:underline mt-2 inline-block">View Job &rarr;</a>}
            </Card>
          ))}</div>}
      </main>
    </div>
  );
}
