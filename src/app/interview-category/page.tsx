'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getQuestionsByCategory } from '@/data/interviewQuestions';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import AnimatedPage from '@/components/AnimatedPage';
import Breadcrumbs from '@/components/Breadcrumbs';
import { InterviewCategory } from '@/types';

const DIFF_COLORS: Record<string, string> = { beginner: 'text-success', intermediate: 'text-warning', advanced: 'text-error' };

function InterviewCategoryContent() {
  const params = useSearchParams();
  const router = useRouter();
  const cat = (params.get('cat') || 'Coding') as InterviewCategory;
  const questions = getQuestionsByCategory(cat);

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
      <Navbar />
      <AnimatedPage>
      <main className="max-w-2xl mx-auto px-5 pt-4 pb-10">
        <Breadcrumbs />
        <PageHeader title={cat} subtitle={`${questions.length} questions`} />
        <div className="space-y-3">
          {questions.map((q) => (
            <Card key={q.id} onClick={() => router.push(`/interview-question?id=${q.id}`)} className="cursor-pointer hover:bg-bg-card-hover transition-colors">
              <p className="text-[15px] font-semibold text-text-primary mb-1">{q.question}</p>
              <div className="flex gap-2">
                <span className={`text-[11px] font-semibold ${DIFF_COLORS[q.difficulty]}`}>{q.difficulty}</span>
                <span className="text-[11px] text-text-muted">{q.type}</span>
              </div>
            </Card>
          ))}
        </div>
      </main>
      </AnimatedPage>
    </div>
  );
}

export default function InterviewCategoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated" />}>
      <InterviewCategoryContent />
    </Suspense>
  );
}
