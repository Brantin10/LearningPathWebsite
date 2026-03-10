'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { getCareer } from '@/services/firestore';
import { Career } from '@/types';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';

export default function SkillsPage() {
  const { profile } = useUser();
  const [career, setCareer] = useState<Career | null>(null);

  useEffect(() => {
    if (profile?.chosenCareer) getCareer(profile.chosenCareer).then(setCareer);
  }, [profile?.chosenCareer]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
      <Navbar />
      <main className="max-w-2xl mx-auto px-5 pt-4 pb-10">
        <PageHeader title="Required Skills" subtitle={career?.name || 'Skills to develop'} />
        {career?.skills?.length ? (
          <div className="space-y-3">
            {career.skills.map((skill, i) => (
              <Card key={i}>
                <div className="flex items-center justify-between">
                  <span className="text-text-primary font-semibold">{skill}</span>
                  {career.skillsURL?.[i] && (
                    <a href={career.skillsURL[i]} target="_blank" rel="noopener noreferrer" className="text-accent text-sm hover:underline">Learn &rarr;</a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card><p className="text-text-secondary">No skills data available.</p></Card>
        )}
      </main>
    </div>
  );
}
