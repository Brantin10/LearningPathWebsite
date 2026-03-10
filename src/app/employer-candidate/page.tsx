'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { useTheme } from '@/hooks/useTheme';
import {
  getUser,
  getCareer,
  getCompletedSteps,
  getLearningPath,
  isBookmarked,
  saveEmployerBookmark,
  removeEmployerBookmark,
  sendContactRequest,
  getOutgoingRequests,
  saveEmployerNote,
  getEmployerNote,
} from '@/services/firestore';
import Avatar from '@/components/Avatar';
import PageHeader from '@/components/PageHeader';
import ProgressBar from '@/components/ProgressBar';
import Card from '@/components/Card';
import Navbar from '@/components/Navbar';
import { Bookmark, BookmarkCheck, Send, Save } from 'lucide-react';
import { AppUser, Career, EmployerBookmark } from '@/types';

function EmployerCandidateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const candidateUid = searchParams.get('candidateUid') || '';
  const { user, loading: authLoading } = useAuth();
  const { profile } = useUser();
  const { colors } = useTheme();

  const [candidate, setCandidate] = useState<AppUser | null>(null);
  const [career, setCareer] = useState<Career | null>(null);
  const [progress, setProgress] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [saved, setSaved] = useState(false);
  const [note, setNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);
  const [alreadyRequested, setAlreadyRequested] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!candidateUid || !user) return;

    async function load() {
      try {
        const [candidateData, isSaved, existingNote, outgoing] = await Promise.all([
          getUser(candidateUid),
          isBookmarked(user!.uid, candidateUid),
          getEmployerNote(user!.uid, candidateUid),
          getOutgoingRequests(user!.uid),
        ]);

        if (!candidateData) {
          window.alert('Candidate not found.');
          router.back();
          return;
        }

        setCandidate(candidateData);
        setSaved(isSaved);
        setNote(existingNote);

        // Check if already sent a request to this candidate
        const hasRequest = outgoing.some(
          (r) => r.toUid === candidateUid && r.status === 'pending'
        );
        setAlreadyRequested(hasRequest);

        // Load career info if candidate has chosen one
        if (candidateData.chosenCareer) {
          const [careerData, completedSteps, learningPath] = await Promise.all([
            getCareer(candidateData.chosenCareer),
            getCompletedSteps(candidateUid, candidateData.chosenCareer),
            getLearningPath(candidateUid, candidateData.chosenCareer),
          ]);

          setCareer(careerData);

          const total = learningPath?.learning_path?.length || 0;
          setTotalSteps(total);
          setProgress(total > 0 ? completedSteps.length / total : 0);
        }
      } catch (err) {
        console.error('Failed to load candidate:', err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [candidateUid, user]);

  const handleToggleBookmark = useCallback(async () => {
    if (!user || !candidate) return;

    try {
      if (saved) {
        await removeEmployerBookmark(user.uid, candidateUid);
        setSaved(false);
      } else {
        const bookmark: EmployerBookmark = {
          seekerUid: candidateUid,
          savedAt: Date.now(),
          seekerName: candidate.username,
          seekerAvatar: candidate.avatar,
          seekerCareer: candidate.chosenCareer,
          seekerSkills: candidate.skills,
        };
        await saveEmployerBookmark(user.uid, bookmark);
        setSaved(true);
      }
    } catch (err) {
      console.error('Bookmark toggle failed:', err);
      window.alert('Failed to update bookmark. Please try again.');
    }
  }, [user, candidate, saved, candidateUid]);

  const handleSendRequest = useCallback(async () => {
    if (!user || !profile || !candidate) return;

    if (alreadyRequested) {
      window.alert('You have already sent a contact request to this candidate.');
      return;
    }

    const confirmed = window.confirm(
      `Send a contact request to ${candidate.username}? They will be able to accept or decline.`
    );
    if (!confirmed) return;

    setSendingRequest(true);
    try {
      await sendContactRequest({
        fromUid: user.uid,
        fromName: profile.username,
        fromAvatar: profile.avatar,
        fromRole: 'employer',
        toUid: candidateUid,
        toName: candidate.username,
        toAvatar: candidate.avatar,
        message: `${profile.username} would like to connect with you.`,
        status: 'pending',
        createdAt: Date.now(),
      });
      setAlreadyRequested(true);
      window.alert('Contact request sent successfully!');
    } catch (err) {
      console.error('Send request failed:', err);
      window.alert('Failed to send contact request. Please try again.');
    } finally {
      setSendingRequest(false);
    }
  }, [user, profile, candidate, alreadyRequested, candidateUid]);

  const handleSaveNote = useCallback(async () => {
    if (!user) return;
    try {
      await saveEmployerNote(user.uid, candidateUid, note);
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 2000);
    } catch (err) {
      console.error('Save note failed:', err);
      window.alert('Failed to save note.');
    }
  }, [user, candidateUid, note]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated flex items-center justify-center">
        <p className="text-text-secondary">Candidate not found.</p>
      </div>
    );
  }

  const skillsArray = candidate.skills
    ? candidate.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];
  const careerName = career?.name || 'Exploring';
  const pctComplete = Math.round(progress * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
      <Navbar />
      <main className="max-w-3xl mx-auto px-5 pt-4 pb-10">
        <PageHeader title="Candidate Profile" />

        {/* Profile Card */}
        <Card className="mb-5">
          <div className="flex items-center gap-4">
            <Avatar index={candidate.avatar} size={72} />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-text-primary">{candidate.username}</h2>
              {candidate.currentJob && (
                <p className="text-sm text-text-secondary mt-0.5">{candidate.currentJob}</p>
              )}
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-accent-muted text-accent border border-[rgba(100,255,218,0.3)]">
                {careerName}
              </span>
            </div>
          </div>
        </Card>

        {/* Learning Progress */}
        {totalSteps > 0 && (
          <Card className="mb-5">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
              Learning Progress
            </h3>
            <ProgressBar progress={progress} label="COMPLETION" />
            <p className="text-xs text-text-muted mt-2">
              {Math.round(progress * totalSteps)} of {totalSteps} steps completed ({pctComplete}%)
            </p>
          </Card>
        )}

        {/* Details Card */}
        <Card className="mb-5">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
            Details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-text-muted">Education</span>
              <span className="text-sm text-text-primary font-medium">
                {candidate.education || 'Not specified'}
              </span>
            </div>
            <div className="border-t border-border" />
            <div className="flex justify-between">
              <span className="text-sm text-text-muted">Age</span>
              <span className="text-sm text-text-primary font-medium">
                {candidate.age || 'Not specified'}
              </span>
            </div>
            <div className="border-t border-border" />
            <div className="flex justify-between">
              <span className="text-sm text-text-muted">Current Role</span>
              <span className="text-sm text-text-primary font-medium">
                {candidate.currentJob || 'Not specified'}
              </span>
            </div>
          </div>
        </Card>

        {/* Skills Chips */}
        {skillsArray.length > 0 && (
          <Card className="mb-5">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {skillsArray.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-primary-muted text-primary border border-[rgba(39,174,96,0.3)]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Card>
        )}

        {/* Notes Section */}
        <Card className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
              Private Notes
            </h3>
            {noteSaved && (
              <span className="text-xs text-primary font-medium">Saved!</span>
            )}
          </div>
          <textarea
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              setNoteSaved(false);
            }}
            placeholder="Add private notes about this candidate..."
            rows={4}
            className="w-full glass-input rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:border-primary transition-colors"
          />
          <button
            onClick={handleSaveNote}
            className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-muted text-primary text-sm font-semibold hover:bg-[rgba(39,174,96,0.25)] transition-colors border border-[rgba(39,174,96,0.3)]"
          >
            <Save size={16} />
            Save Note
          </button>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleToggleBookmark}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-colors border ${
              saved
                ? 'bg-accent-muted text-accent border-[rgba(100,255,218,0.4)] hover:bg-[rgba(100,255,218,0.25)]'
                : 'bg-primary-muted text-primary border-[rgba(39,174,96,0.4)] hover:bg-[rgba(39,174,96,0.25)]'
            }`}
          >
            {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            {saved ? 'Saved' : 'Save Candidate'}
          </button>
          <button
            onClick={handleSendRequest}
            disabled={alreadyRequested || sendingRequest}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-colors ${
              alreadyRequested
                ? 'bg-bg-card text-text-muted border border-border cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary-dark'
            }`}
          >
            <Send size={18} />
            {alreadyRequested ? 'Request Sent' : sendingRequest ? 'Sending...' : 'Send Contact Request'}
          </button>
        </div>
      </main>
    </div>
  );
}

export default function EmployerCandidatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated" />}>
      <EmployerCandidateContent />
    </Suspense>
  );
}
