'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { QUESTIONS, getVisibleQuestions } from '@/data/questions';
import { saveAnswers, updateUser } from '@/services/firestore';
import { Answers } from '@/types';
import Navbar from '@/components/Navbar';
import ProgressBar from '@/components/ProgressBar';
import Button from '@/components/Button';
import AnimatedPage from '@/components/AnimatedPage';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuestionnairePage() {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const [answers, setAnswers] = useState<Answers>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const visibleQuestions = useMemo(() => getVisibleQuestions(answers), [answers]);
  const question = visibleQuestions[currentIndex];
  const isLast = currentIndex >= visibleQuestions.length - 1;
  const progress = visibleQuestions.length > 0 ? (currentIndex + 1) / visibleQuestions.length : 0;

  const setAnswer = (value: any) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  };

  const currentAnswer = answers[question?.id];

  const toggleMultiSelect = (option: string) => {
    const current: string[] = currentAnswer || [];
    const updated = current.includes(option) ? current.filter((o) => o !== option) : [...current, option];
    setAnswer(updated);
  };

  const canProceed = () => {
    if (!question) return false;
    if (!question.required) return true;
    if (currentAnswer === undefined || currentAnswer === '') return false;
    if (question.type === 'MULTI_SELECT' && (!currentAnswer || currentAnswer.length === 0)) return false;
    return true;
  };

  const handleNext = () => {
    if (!canProceed() && question.required) {
      toast.warning('Please answer this question.');
      return;
    }
    if (isLast) handleSubmit();
    else setCurrentIndex((i) => Math.min(i + 1, visibleQuestions.length - 1));
  };

  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
    else router.back();
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await saveAnswers(user.uid, answers);
      if (answers.desired_role) await updateUser(user.uid, { desiredJob: answers.desired_role });
      toast.success('Your answers have been saved!');
      router.push('/career-match');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  if (!question) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
      <Navbar />
      <AnimatedPage>
      <main className="max-w-2xl mx-auto px-6 pt-4 pb-10 flex flex-col min-h-[calc(100vh-64px)]">
        <ProgressBar progress={progress} label={`Question ${currentIndex + 1} of ${visibleQuestions.length}`} />

        <AnimatePresence mode="wait">
          <motion.div key={question.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="mt-8 mb-6">
            <h2 className="text-2xl font-bold text-text-primary leading-8">{question.text}</h2>
            {question.helperText && <p className="text-sm text-text-secondary mt-2">{question.helperText}</p>}
          </motion.div>
        </AnimatePresence>

        <div className="flex-1 mb-8">
          {question.type === 'TEXT' && (
            <textarea
              value={currentAnswer || ''}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer..."
              className="w-full glass-input rounded-xl p-4 text-text-primary text-[15px] min-h-[54px] placeholder:text-text-muted"
            />
          )}

          {question.type === 'YEARS' && (
            <input
              type="number"
              value={currentAnswer || ''}
              onChange={(e) => setAnswer(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="Enter years"
              className="w-full glass-input rounded-xl p-4 text-text-primary text-[15px] placeholder:text-text-muted"
            />
          )}

          {question.type === 'YES_NO' && (
            <div className="flex gap-3">
              {['Yes', 'No'].map((opt) => (
                <button key={opt} onClick={() => setAnswer(opt)} className={`flex-1 py-4 rounded-xl text-lg font-semibold transition-colors border ${currentAnswer === opt ? 'bg-primary-muted border-[rgba(39,174,96,0.4)] text-primary' : 'glass-card text-text-secondary'}`}>
                  {opt}
                </button>
              ))}
            </div>
          )}

          {question.type === 'SINGLE_CHOICE' && question.options && (
            <div className="space-y-2">
              {question.options.map((opt) => (
                <button key={opt} onClick={() => setAnswer(opt)} className={`w-full text-left py-3.5 px-4 rounded-xl transition-colors border ${currentAnswer === opt ? 'bg-primary-muted border-[rgba(39,174,96,0.4)] text-primary font-semibold' : 'glass-card text-text-secondary'}`}>
                  {opt}
                </button>
              ))}
            </div>
          )}

          {question.type === 'MULTI_SELECT' && question.options && (
            <div className="space-y-2">
              {question.options.map((opt) => {
                const isSelected = (currentAnswer || []).includes(opt);
                return (
                  <button key={opt} onClick={() => toggleMultiSelect(opt)} className={`w-full text-left py-3.5 px-4 rounded-xl transition-colors border ${isSelected ? 'bg-primary-muted border-[rgba(39,174,96,0.4)] text-primary font-semibold' : 'glass-card text-text-secondary'}`}>
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {question.type === 'SCALE_1_5' && (
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <button key={val} onClick={() => setAnswer(val.toString())} className={`flex-1 aspect-square max-h-16 rounded-xl flex items-center justify-center text-xl font-bold transition-colors border ${currentAnswer === val.toString() ? 'bg-primary-muted border-[rgba(39,174,96,0.4)] text-primary' : 'glass-card text-text-secondary'}`}>
                  {val}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button title="Back" onPress={handleBack} variant="outline" className="flex-1" />
          <Button title={isLast ? 'Submit' : 'Next'} onPress={handleNext} loading={loading} className="flex-1" />
        </div>
      </main>
      </AnimatedPage>
    </div>
  );
}
