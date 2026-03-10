'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { getCareer } from '@/services/firestore';
import { Career } from '@/types';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import { GraduationCap, Wrench, ListOrdered, Briefcase } from 'lucide-react';

export default function CareerManagerPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile } = useUser();
  const [career, setCareer] = useState<Career | null>(null);

  useEffect(() => {
    if (profile?.chosenCareer) {
      getCareer(profile.chosenCareer).then(setCareer);
    }
  }, [profile?.chosenCareer]);

  if (!profile?.chosenCareer) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
        <Navbar />
        <main className="max-w-2xl mx-auto px-5 pt-4 pb-10">
          <PageHeader title="My Career" />
          <Card className="text-center py-8">
            <p className="text-4xl mb-4">🎯</p>
            <p className="text-text-primary font-semibold mb-2">No Career Selected</p>
            <p className="text-text-secondary text-sm mb-4">Take the career quiz to find your match.</p>
            <button onClick={() => router.push('/questionnaire')} className="text-accent hover:underline text-sm">Take Career Quiz</button>
          </Card>
        </main>
      </div>
    );
  }

  const cards = [
    { title: 'Education', desc: 'Required education and qualifications', icon: <GraduationCap size={24} />, href: '/education' },
    { title: 'Skills', desc: 'Skills you need to develop', icon: <Wrench size={24} />, href: '/skills' },
    { title: 'Learning Steps', desc: 'Your personalized learning roadmap', icon: <ListOrdered size={24} />, href: '/steps' },
    { title: 'Related Jobs', desc: 'Job openings for this career', icon: <Briefcase size={24} />, href: '/jobs' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
      <Navbar />
      <main className="max-w-2xl mx-auto px-5 pt-4 pb-10">
        <PageHeader title={career?.name || 'My Career'} subtitle="Your career dashboard" />
        {career?.description && <p className="text-text-secondary text-sm mb-6">{career.description}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map((card) => (
            <Card key={card.title} onClick={() => router.push(card.href)} variant="elevated" className="cursor-pointer hover:border-primary transition-colors">
              <div className="text-primary mb-3">{card.icon}</div>
              <h3 className="text-lg font-semibold text-text-primary">{card.title}</h3>
              <p className="text-sm text-text-secondary mt-1">{card.desc}</p>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
