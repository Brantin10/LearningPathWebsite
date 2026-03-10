'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/Button';

const slides = [
  { emoji: '🎯', title: 'Discover Your Path', desc: 'Take our career quiz and let AI match you with your ideal career based on your skills and interests.' },
  { emoji: '📚', title: 'Personalized Learning', desc: 'Get a custom step-by-step learning roadmap with resources tailored to your background and goals.' },
  { emoji: '💼', title: 'Land Your Dream Job', desc: 'Search jobs, build your resume, practice interviews, and track applications — all in one place.' },
  { emoji: '🚀', title: 'Track Your Growth', desc: 'Monitor your progress with badges, streaks, and daily actions. Join a community of career changers.' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);

  const next = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    } else {
      router.push('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-12"
          >
            <p className="text-6xl mb-6">{slides[current].emoji}</p>
            <h2 className="text-2xl font-bold text-text-primary mb-3">{slides[current].title}</h2>
            <p className="text-text-secondary">{slides[current].desc}</p>
          </motion.div>
        </AnimatePresence>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`
                h-2 rounded-full transition-all duration-300
                ${i === current ? 'w-6 bg-primary' : 'w-2 bg-border-light'}
              `}
            />
          ))}
        </div>

        <Button
          title={current === slides.length - 1 ? 'Create Account' : 'Next'}
          onPress={next}
          className="w-full"
        />

        {current < slides.length - 1 && (
          <button
            onClick={() => router.push('/signup')}
            className="w-full mt-3 py-3 text-text-secondary text-sm hover:text-text-primary transition-colors"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}
