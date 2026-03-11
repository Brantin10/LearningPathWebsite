'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/useToast';
import { updateUser } from '@/services/firestore';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import Input from '@/components/Input';
import TextArea from '@/components/TextArea';
import Button from '@/components/Button';
import Avatar from '@/components/Avatar';
import AnimatedPage from '@/components/AnimatedPage';

const SKILL_OPTIONS = ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'HTML/CSS', 'Java', 'TypeScript', 'C#', 'Git', 'AWS', 'Docker', 'Excel', 'Marketing', 'Design', 'Communication'];

export default function ProfileSetupPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile } = useUser();
  const toast = useToast();
  const [age, setAge] = useState('');
  const [currentJob, setCurrentJob] = useState('');
  const [education, setEducation] = useState('');
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setAge(profile.age || '');
      setCurrentJob(profile.currentJob || '');
      setEducation(profile.education || '');
      setSkills(profile.skills || '');
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await updateUser(user.uid, {
        age,
        currentJob,
        education,
        skills,
        profileCompleted: true,
      });
      toast.success('Profile saved!');
    } catch (e: any) {
      toast.error(e.message || 'Failed to save profile.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skill: string) => {
    const current = skills.split(',').map(s => s.trim()).filter(Boolean);
    const updated = current.includes(skill) ? current.filter(s => s !== skill) : [...current, skill];
    setSkills(updated.join(', '));
  };

  const currentSkills = skills.split(',').map(s => s.trim()).filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
      <Navbar />
      <AnimatedPage>
      <main className="max-w-2xl mx-auto px-5 pt-4 pb-10">
        <PageHeader title="Profile Setup" subtitle="Tell us about yourself" />

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <button onClick={() => router.push('/avatar')}>
            <Avatar index={profile?.avatar ?? 0} size={100} />
            <p className="text-center text-accent text-sm mt-2">Change Avatar</p>
          </button>
        </div>

        <Input label="Age" type="number" placeholder="Enter your age" value={age} onChange={(e) => setAge(e.target.value)} />
        <Input label="Current Job" placeholder="e.g., Retail Associate" value={currentJob} onChange={(e) => setCurrentJob(e.target.value)} />
        <Input label="Education" placeholder="e.g., Bachelor's in Business" value={education} onChange={(e) => setEducation(e.target.value)} />

        {/* Skills */}
        <div className="mb-5">
          <label className="block text-[11px] font-semibold text-text-secondary mb-2 tracking-[1.5px] uppercase">Skills</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {SKILL_OPTIONS.map((skill) => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
                  currentSkills.includes(skill)
                    ? 'bg-primary-muted border-[rgba(39,174,96,0.4)] text-primary'
                    : 'glass-card text-text-secondary hover:text-text-primary'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
          <TextArea placeholder="Add custom skills (comma-separated)" value={skills} onChange={(e) => setSkills(e.target.value)} />
        </div>

        <Button title="Save Profile" onPress={handleSave} loading={loading} className="w-full" />
      </main>
      </AnimatedPage>
    </div>
  );
}
