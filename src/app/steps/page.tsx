'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/useToast';
import { getLearningPath, getCompletedSteps, saveCompletedSteps, saveLearningPath, logActivity } from '@/services/firestore';
import { generateLearningPath, checkApiHealth } from '@/services/learningPath';
import { LearningStep } from '@/types';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import StepCard from '@/components/StepCard';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { PageSkeleton } from '@/components/Skeleton';
import AnimatedPage from '@/components/AnimatedPage';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function StepsPage() {
  const { user } = useAuth();
  const { profile } = useUser();
  const toast = useToast();
  const [steps, setSteps] = useState<LearningStep[]>([]);
  const [completed, setCompleted] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const careerId = profile?.chosenCareer || '';

  useEffect(() => {
    if (!user || !careerId) { setLoading(false); return; }
    Promise.all([getLearningPath(user.uid, careerId), getCompletedSteps(user.uid, careerId)])
      .then(([path, done]) => {
        if (path?.learning_path) setSteps(path.learning_path);
        setCompleted(done);
        setLoading(false);
      });
    checkApiHealth().then((h) => setApiOnline(h.ok));
  }, [user, careerId]);

  const toggleStep = async (stepNum: number) => {
    if (!user || !careerId) return;
    const updated = completed.includes(stepNum) ? completed.filter((n) => n !== stepNum) : [...completed, stepNum];
    setCompleted(updated);
    await saveCompletedSteps(user.uid, careerId, updated);
    if (!completed.includes(stepNum)) await logActivity(user.uid, careerId, 'completed_step', `Step ${stepNum}`);
  };

  const handleGenerate = async () => {
    if (!user || !profile) return;
    setGenerating(true);
    try {
      const result = await generateLearningPath({
        user_uid: user.uid,
        target_career: profile.chosenCareer || profile.desiredJob || '',
        education: profile.education,
        skills: profile.skills,
        current_job: profile.currentJob,
      });
      setSteps(result.learning_path || []);
      await saveLearningPath(user.uid, careerId, result);
    } catch (e: any) {
      toast.error(e.message || 'Failed to generate learning path.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
      <Navbar />
      <AnimatedPage>
        <main className="max-w-2xl mx-auto px-5 pt-4 pb-10">
          <Breadcrumbs />
          <PageHeader title="Learning Steps" subtitle="Your personalized roadmap" />

        {loading ? (
          <PageSkeleton />
        ) : steps.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-4xl mb-4">📚</p>
            <p className="text-text-primary font-semibold mb-2">No Learning Path Yet</p>
            <p className="text-text-secondary text-sm mb-4">
              {apiOnline === false ? 'The Learning Path server is offline. Configure the URL in Settings.' : 'Generate an AI-powered learning path tailored to your background.'}
            </p>
            <Button title={generating ? 'Generating (~5 min)...' : 'Generate Learning Path'} onPress={handleGenerate} loading={generating} disabled={apiOnline === false} />
            {apiOnline === false && <p className="text-error text-xs mt-2">Server offline — check Settings to configure the URL.</p>}
          </Card>
        ) : (
          <>
            <div className="mb-4 text-sm text-text-secondary">{completed.length} / {steps.length} steps completed</div>
            {steps.map((step) => (
              <StepCard key={step.step_number} step={step} completed={completed.includes(step.step_number)} onToggle={() => toggleStep(step.step_number)} />
            ))}
            <Button title="Regenerate Path" onPress={handleGenerate} variant="outline" loading={generating} className="w-full mt-4" />
          </>
        )}
      </main>
      </AnimatedPage>
    </div>
  );
}
