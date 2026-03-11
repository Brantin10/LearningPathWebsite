'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getCareer, updateUser } from '@/services/firestore';
import { Career } from '@/types';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { PageSkeleton } from '@/components/Skeleton';
import AnimatedPage from '@/components/AnimatedPage';
import ScrollReveal from '@/components/ScrollReveal';
import Breadcrumbs from '@/components/Breadcrumbs';

function CareerDetailContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const careerId = params.get('id') || '';
  const [career, setCareer] = useState<Career | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (careerId) {
      getCareer(careerId).then((c) => { setCareer(c); setLoading(false); }).catch(() => setLoading(false));
    }
  }, [careerId]);

  const handleChoose = async () => {
    if (!user || !career) return;
    await updateUser(user.uid, { chosenCareer: career.uid });
    router.push('/career-manager');
  };

  if (loading) return <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated"><PageSkeleton /></div>;
  if (!career) return <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated"><Navbar /><AnimatedPage><main className="max-w-2xl mx-auto px-5 pt-4"><PageHeader title="Career Not Found" /><p className="text-text-secondary">This career could not be loaded.</p></main></AnimatedPage></div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
      <Navbar />
      <AnimatedPage>
        <main className="max-w-2xl mx-auto px-5 pt-4 pb-10">
          <Breadcrumbs />
          <PageHeader title={career.name} subtitle={career.category} />

        <ScrollReveal>
          <Card className="mb-4">
            <h3 className="text-sm font-semibold text-accent uppercase tracking-wider mb-2">Description</h3>
            <p className="text-text-secondary text-sm leading-6">{career.description}</p>
          </Card>
        </ScrollReveal>

        {career.skills?.length > 0 && (
          <ScrollReveal delay={0.1}>
            <Card className="mb-4">
              <h3 className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {career.skills.map((skill, i) => (
                  <a key={i} href={career.skillsURL?.[i]} target="_blank" rel="noopener noreferrer" className="bg-primary-muted text-primary px-3 py-1 rounded-full text-sm hover:underline">{skill}</a>
                ))}
              </div>
            </Card>
          </ScrollReveal>
        )}

        {career.education?.length > 0 && (
          <ScrollReveal delay={0.2}>
            <Card className="mb-4">
              <h3 className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Education Paths</h3>
              <ul className="space-y-2">
                {career.education.map((edu, i) => (
                  <li key={i} className="text-text-secondary text-sm flex items-start gap-2">
                    <span className="text-primary mt-0.5">&#8226;</span>
                    {career.educationUrls?.[i] ? <a href={career.educationUrls[i]} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{edu}</a> : edu}
                  </li>
                ))}
              </ul>
            </Card>
          </ScrollReveal>
        )}

        {career.futureOutlook && (
          <ScrollReveal delay={0.3}>
            <Card className="mb-4">
              <h3 className="text-sm font-semibold text-accent uppercase tracking-wider mb-2">Future Outlook</h3>
              <p className="text-text-secondary text-sm">{career.futureOutlook}</p>
            </Card>
          </ScrollReveal>
        )}

        <Button title="Choose This Career" onPress={handleChoose} className="w-full mt-4" />
      </main>
      </AnimatedPage>
    </div>
  );
}

export default function CareerDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated" />}>
      <CareerDetailContent />
    </Suspense>
  );
}
