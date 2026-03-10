'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { getAllCareers, getLatestAnswers, updateUser } from '@/services/firestore';
import { matchCareers } from '@/data/careerMatcher';
import { Career, Answers } from '@/types';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function CareerMatchPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile } = useUser();
  const [careers, setCareers] = useState<Career[]>([]);
  const [answers, setAnswers] = useState<Answers | null>(null);
  const [matches, setMatches] = useState<{ career: Career; score: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([getAllCareers(), getLatestAnswers(user.uid)])
      .then(([c, a]) => {
        setCareers(c);
        setAnswers(a);
        if (a && c.length > 0) {
          const m = matchCareers(c, a);
          setMatches(m.slice(0, 5));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const handleChoose = async (career: Career) => {
    if (!user) return;
    try {
      await updateUser(user.uid, { chosenCareer: career.uid });
      router.push('/career-manager');
    } catch (e: any) {
      alert(e.message || 'Failed to select career.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
      <Navbar />
      <main className="max-w-2xl mx-auto px-5 pt-4 pb-10">
        <PageHeader title="Career Matches" subtitle="Based on your quiz answers" />

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="flex gap-1">
              <span className="typing-dot w-3 h-3 rounded-full bg-primary" />
              <span className="typing-dot w-3 h-3 rounded-full bg-primary" />
              <span className="typing-dot w-3 h-3 rounded-full bg-primary" />
            </div>
          </div>
        ) : !answers ? (
          <Card className="text-center py-8">
            <p className="text-4xl mb-4">📋</p>
            <p className="text-text-primary font-semibold mb-2">No Quiz Results Yet</p>
            <p className="text-text-secondary text-sm mb-4">Take the career quiz first to get matched.</p>
            <Button title="Take Quiz" onPress={() => router.push('/questionnaire')} className="mx-auto" />
          </Card>
        ) : matches.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-text-secondary">No matching careers found. Try retaking the quiz.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {matches.map(({ career, score }, i) => (
              <Card key={career.uid} variant={i === 0 ? 'elevated' : 'default'} className="relative">
                {i === 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    Best Match
                  </span>
                )}
                <h3 className="text-lg font-bold text-text-primary">{career.name}</h3>
                <p className="text-sm text-text-secondary mt-1 mb-3">{career.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {career.skills?.slice(0, 5).map((skill) => (
                    <span key={skill} className="text-[11px] bg-accent-muted text-accent px-2 py-0.5 rounded-full">{skill}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-accent font-semibold">Match: {Math.round(score)}%</span>
                  <div className="flex gap-2">
                    <Button title="Details" onPress={() => router.push(`/career-detail?id=${career.uid}`)} variant="outline" className="text-sm py-2 px-4 min-h-0" />
                    <Button title={profile?.chosenCareer === career.uid ? 'Selected' : 'Choose'} onPress={() => handleChoose(career)} variant={profile?.chosenCareer === career.uid ? 'secondary' : 'primary'} className="text-sm py-2 px-4 min-h-0" disabled={profile?.chosenCareer === career.uid} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
