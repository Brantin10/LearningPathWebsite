'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES } from '@/data/interviewQuestions';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';

const CATEGORY_ICONS: Record<string, string> = { 'Coding': '💻', 'Cloud / DevOps': '☁️', 'AI / Machine Learning': '🤖', 'Management': '📊', 'Sales / Consulting': '💼', 'Creative / Design': '🎨', 'Healthcare': '🏥', 'Education': '📚' };

export default function InterviewPrepPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
      <Navbar />
      <main className="max-w-2xl mx-auto px-5 pt-4 pb-10">
        <PageHeader title="Interview Prep" subtitle="Practice with curated questions" />
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((cat) => (
            <Card key={cat} onClick={() => router.push(`/interview-category?cat=${encodeURIComponent(cat)}`)} className="cursor-pointer text-center hover:bg-bg-card-hover transition-colors">
              <p className="text-3xl mb-2">{CATEGORY_ICONS[cat] || '📋'}</p>
              <p className="text-sm font-semibold text-text-primary">{cat}</p>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
