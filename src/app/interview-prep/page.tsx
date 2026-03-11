'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CATEGORIES } from '@/data/interviewQuestions';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import AnimatedPage from '@/components/AnimatedPage';
import StaggerList, { StaggerItem } from '@/components/StaggerList';

const CATEGORY_ICONS: Record<string, string> = { 'Coding': '💻', 'Cloud / DevOps': '☁️', 'AI / Machine Learning': '🤖', 'Management': '📊', 'Sales / Consulting': '💼', 'Creative / Design': '🎨', 'Healthcare': '🏥', 'Education': '📚' };

export default function InterviewPrepPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
      <Navbar />
      <AnimatedPage>
      <main className="max-w-2xl mx-auto px-5 pt-4 pb-10">
        <PageHeader title="Interview Prep" subtitle="Practice with curated questions" />
        <StaggerList className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((cat) => (
            <StaggerItem key={cat}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <Card onClick={() => router.push(`/interview-category?cat=${encodeURIComponent(cat)}`)} variant="interactive" className="cursor-pointer text-center">
                  <p className="text-3xl mb-2">{CATEGORY_ICONS[cat] || '📋'}</p>
                  <p className="text-sm font-semibold text-text-primary">{cat}</p>
                </Card>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerList>
      </main>
      </AnimatedPage>
    </div>
  );
}
