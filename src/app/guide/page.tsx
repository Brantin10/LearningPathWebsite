'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import AnimatedPage from '@/components/AnimatedPage';
import ScrollReveal from '@/components/ScrollReveal';

const steps = [
  { num: 1, title: 'Take the Career Quiz', desc: 'Answer a few questions about your skills, interests, and goals so we can match you with ideal careers.' },
  { num: 2, title: 'Choose Your Career', desc: 'Review your top career matches and select the one that excites you most.' },
  { num: 3, title: 'Get Your Learning Path', desc: 'Receive an AI-generated step-by-step roadmap tailored to your background and target career.' },
  { num: 4, title: 'Build Your Resume', desc: 'Use our CV builder to create a professional resume highlighting your skills and experience.' },
  { num: 5, title: 'Search for Jobs', desc: 'Browse remote job openings and track your applications from one dashboard.' },
  { num: 6, title: 'Prepare for Interviews', desc: 'Practice with curated interview questions using the STAR method framework.' },
  { num: 7, title: 'Track Your Progress', desc: 'Earn badges, maintain streaks, and watch your career journey unfold.' },
  { num: 8, title: 'Join the Community', desc: 'Connect with other career changers, share tips, and get support.' },
];

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
      <Navbar />
      <AnimatedPage>
      <main className="max-w-2xl mx-auto px-5 pt-4 pb-10">
        <PageHeader title="How to Get Started" subtitle="A step-by-step guide to using MyFutureCareer" />
        <div className="space-y-3">
          {steps.map((step, idx) => (
            <ScrollReveal key={step.num} delay={idx * 0.05}>
              <Card className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-muted flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-lg">{step.num}</span>
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-text-primary">{step.title}</h3>
                  <p className="text-[13px] text-text-secondary mt-1">{step.desc}</p>
                </div>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </main>
      </AnimatedPage>
    </div>
  );
}
