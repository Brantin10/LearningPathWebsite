'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { INTERVIEW_QUESTIONS } from '@/data/interviewQuestions';
import { saveInterviewAttempt } from '@/services/firestore';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Button from '@/components/Button';
import TextArea from '@/components/TextArea';
import AnimatedPage from '@/components/AnimatedPage';
import Breadcrumbs from '@/components/Breadcrumbs';

function InterviewQuestionContent() {
  const params = useSearchParams();
  const { user } = useAuth();
  const qId = params.get('id') || '';
  const question = INTERVIEW_QUESTIONS.find((q) => q.id === qId);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [rating, setRating] = useState(0);
  const [saved, setSaved] = useState(false);

  if (!question) return <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated"><Navbar /><AnimatedPage><main className="max-w-2xl mx-auto px-5 pt-4"><PageHeader title="Question Not Found" /></main></AnimatedPage></div>;

  const handleSave = async () => {
    if (!user) return;
    await saveInterviewAttempt(user.uid, { questionId: question.id, userAnswer, attemptedAt: Date.now(), selfRating: rating });
    setSaved(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
      <Navbar />
      <AnimatedPage>
      <main className="max-w-2xl mx-auto px-5 pt-4 pb-10">
        <Breadcrumbs />
        <PageHeader title={question.category} subtitle={`${question.difficulty} - ${question.type}`} />

        <Card className="mb-4">
          <h2 className="text-xl font-bold text-text-primary leading-7">{question.question}</h2>
        </Card>

        {/* STAR Guidance */}
        <Card className="mb-4">
          <h3 className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">STAR Method Guide</h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-semibold text-primary">Situation:</span> <span className="text-text-secondary">{question.starGuidance.situation}</span></p>
            <p><span className="font-semibold text-primary">Task:</span> <span className="text-text-secondary">{question.starGuidance.task}</span></p>
            <p><span className="font-semibold text-primary">Action:</span> <span className="text-text-secondary">{question.starGuidance.action}</span></p>
            <p><span className="font-semibold text-primary">Result:</span> <span className="text-text-secondary">{question.starGuidance.result}</span></p>
          </div>
        </Card>

        {/* Sample Answer */}
        <button onClick={() => setShowAnswer(!showAnswer)} className="text-accent text-sm hover:underline mb-4 block">{showAnswer ? 'Hide' : 'Show'} Sample Answer</button>
        {showAnswer && <Card className="mb-4"><p className="text-text-secondary text-sm leading-6">{question.sampleAnswer}</p></Card>}

        {/* Tips */}
        <Card className="mb-4">
          <h3 className="text-sm font-semibold text-accent uppercase tracking-wider mb-2">Tips</h3>
          <ul className="space-y-1">{question.tips.map((tip, i) => <li key={i} className="text-sm text-text-secondary flex items-start gap-2"><span className="text-primary">&#8226;</span>{tip}</li>)}</ul>
        </Card>

        {/* Your Answer */}
        <TextArea label="Your Answer" value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} placeholder="Practice your answer here..." />

        {/* Self Rating */}
        <div className="mb-4">
          <label className="block text-[11px] font-semibold text-text-secondary mb-2 tracking-[1.5px] uppercase">Self Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((v) => (
              <button key={v} onClick={() => setRating(v)} className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold transition-colors border ${rating === v ? 'bg-primary-muted border-[rgba(39,174,96,0.4)] text-primary' : 'glass-card text-text-secondary'}`}>{v}</button>
            ))}
          </div>
        </div>

        <Button title={saved ? 'Saved!' : 'Save Attempt'} onPress={handleSave} disabled={saved} className="w-full" />
      </main>
      </AnimatedPage>
    </div>
  );
}

export default function InterviewQuestionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated" />}>
      <InterviewQuestionContent />
    </Suspense>
  );
}
