'use client';

import React, { useState } from 'react';
import { SKILL_QUIZZES } from '@/data/skillQuizzes';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function SkillQuizPage() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const quiz = selectedSkill ? SKILL_QUIZZES.find((q) => q.skill === selectedSkill) : null;
  const question = quiz?.questions[currentQ];

  const handleAnswer = (idx: number) => {
    if (answered !== null) return;
    setAnswered(idx);
    if (idx === question?.correctIndex) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (!quiz) return;
    if (currentQ >= quiz.questions.length - 1) { setFinished(true); return; }
    setCurrentQ((c) => c + 1);
    setAnswered(null);
  };

  const reset = () => { setSelectedSkill(null); setCurrentQ(0); setScore(0); setAnswered(null); setFinished(false); };

  if (!selectedSkill) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
        <Navbar />
        <main className="max-w-2xl mx-auto px-5 pt-4 pb-10">
          <PageHeader title="Skill Quiz" subtitle="Test your knowledge" />
          <div className="grid grid-cols-2 gap-3">
            {SKILL_QUIZZES.map((q) => (
              <Card key={q.skill} onClick={() => setSelectedSkill(q.skill)} className="cursor-pointer text-center hover:bg-bg-card-hover transition-colors">
                <p className="text-lg font-semibold text-text-primary">{q.skill}</p>
                <p className="text-xs text-text-secondary mt-1">{q.questions.length} questions</p>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
        <Navbar />
        <main className="max-w-2xl mx-auto px-5 pt-4 pb-10">
          <PageHeader title="Quiz Complete" />
          <Card className="text-center py-8">
            <p className="text-5xl mb-4">{score >= (quiz?.questions.length || 0) * 0.8 ? '🏆' : score >= (quiz?.questions.length || 0) * 0.5 ? '👍' : '📚'}</p>
            <p className="text-2xl font-bold text-text-primary">{score} / {quiz?.questions.length}</p>
            <p className="text-text-secondary mt-2">{selectedSkill} Quiz</p>
            <Button title="Try Another" onPress={reset} className="mt-6 mx-auto" />
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
      <Navbar />
      <main className="max-w-2xl mx-auto px-5 pt-4 pb-10">
        <PageHeader title={selectedSkill || ''} subtitle={`Question ${currentQ + 1} of ${quiz?.questions.length}`} />
        <Card className="mb-4">
          <p className="text-lg font-semibold text-text-primary">{question?.question}</p>
        </Card>
        <div className="space-y-2 mb-6">
          {question?.options.map((opt, i) => (
            <button key={i} onClick={() => handleAnswer(i)} className={`w-full text-left py-3 px-4 rounded-xl transition-colors border text-sm ${answered !== null ? (i === question.correctIndex ? 'bg-primary-muted border-[rgba(39,174,96,0.4)] text-primary' : i === answered ? 'bg-error-muted border-[rgba(255,107,107,0.4)] text-error' : 'glass-card text-text-secondary') : 'glass-card text-text-secondary hover:text-text-primary'}`}>
              {opt}
            </button>
          ))}
        </div>
        {answered !== null && question?.explanation && <Card className="mb-4"><p className="text-sm text-text-secondary">{question.explanation}</p></Card>}
        {answered !== null && <Button title={currentQ >= (quiz?.questions.length || 0) - 1 ? 'See Results' : 'Next'} onPress={handleNext} className="w-full" />}
      </main>
    </div>
  );
}
