'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { getCareer } from '@/services/firestore';
import { Career } from '@/types';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import AnimatedPage from '@/components/AnimatedPage';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function EducationPage() {
  const { profile } = useUser();
  const [career, setCareer] = useState<Career | null>(null);

  useEffect(() => {
    if (profile?.chosenCareer) getCareer(profile.chosenCareer).then(setCareer);
  }, [profile?.chosenCareer]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
      <Navbar />
      <AnimatedPage>
      <main className="max-w-2xl mx-auto px-5 pt-4 pb-10">
        <Breadcrumbs />
        <PageHeader title="Education" subtitle={career?.name || 'Required qualifications'} />
        {career?.education?.length ? (
          <div className="space-y-3">
            {career.education.map((edu, i) => (
              <Card key={i}>
                <div className="flex items-start gap-3">
                  <span className="text-primary text-lg">🎓</span>
                  <div>
                    <p className="text-text-primary font-semibold">{edu}</p>
                    {career.educationUrls?.[i] && (
                      <a href={career.educationUrls[i]} target="_blank" rel="noopener noreferrer" className="text-accent text-sm hover:underline mt-1 inline-block">Learn more &rarr;</a>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card><p className="text-text-secondary">No education data available.</p></Card>
        )}
      </main>
      </AnimatedPage>
    </div>
  );
}
