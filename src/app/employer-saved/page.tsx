'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/useToast';
import { getEmployerBookmarks, removeEmployerBookmark } from '@/services/firestore';
import Avatar from '@/components/Avatar';
import PageHeader from '@/components/PageHeader';
import Navbar from '@/components/Navbar';
import { PageSkeleton } from '@/components/Skeleton';
import AnimatedPage from '@/components/AnimatedPage';
import EmptyState from '@/components/EmptyState';
import { X, Search } from 'lucide-react';
import { EmployerBookmark } from '@/types';

export default function EmployerSavedPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { profile } = useUser();
  const { colors } = useTheme();
  const toast = useToast();

  const [bookmarks, setBookmarks] = useState<EmployerBookmark[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBookmarks = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getEmployerBookmarks(user.uid);
      // Sort by most recently saved
      data.sort((a, b) => b.savedAt - a.savedAt);
      setBookmarks(data);
    } catch (err) {
      console.error('Failed to load bookmarks:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  const handleRemove = useCallback(
    async (seekerUid: string, seekerName: string) => {
      if (!user) return;
      const confirmed = window.confirm(`Remove ${seekerName} from your saved candidates?`);
      if (!confirmed) return;

      try {
        await removeEmployerBookmark(user.uid, seekerUid);
        setBookmarks((prev) => prev.filter((b) => b.seekerUid !== seekerUid));
      } catch (err) {
        console.error('Remove bookmark failed:', err);
        toast.error('Failed to remove bookmark. Please try again.');
      }
    },
    [user]
  );

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
        <PageSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
      <Navbar />
      <AnimatedPage>
        <main className="max-w-3xl mx-auto px-5 pt-4 pb-10">
          <PageHeader title="Saved Candidates" subtitle="YOUR TALENT" />

        {/* Count */}
        <p className="text-sm text-text-secondary mb-5">
          {bookmarks.length} saved candidate{bookmarks.length !== 1 ? 's' : ''}
        </p>

        {bookmarks.length === 0 ? (
          <EmptyState
            icon="🔖"
            title="No saved candidates yet"
            description="Browse candidates and save the ones that match your needs."
            actionLabel="Browse Candidates"
            onAction={() => router.push('/employer-browse')}
          />
        ) : (
          /* Bookmark Cards */
          <div className="space-y-3">
            {bookmarks.map((bookmark) => {
              const skillsArray = bookmark.seekerSkills
                ? bookmark.seekerSkills.split(',').map((s) => s.trim()).filter(Boolean)
                : [];

              return (
                <div
                  key={bookmark.seekerUid}
                  className="glass-card rounded-2xl p-4 flex items-start gap-4 group"
                >
                  {/* Clickable area */}
                  <button
                    onClick={() => router.push(`/employer-candidate?candidateUid=${bookmark.seekerUid}`)}
                    className="flex items-start gap-4 flex-1 text-left min-w-0 hover:opacity-90 transition-opacity"
                  >
                    <Avatar index={bookmark.seekerAvatar} size={48} />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[15px] font-semibold text-text-primary truncate">
                        {bookmark.seekerName}
                      </h3>
                      {bookmark.seekerCareer && (
                        <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent-muted text-accent border border-[rgba(100,255,218,0.3)]">
                          {bookmark.seekerCareer}
                        </span>
                      )}
                      {skillsArray.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {skillsArray.slice(0, 4).map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary-muted text-primary border border-[rgba(39,174,96,0.3)]"
                            >
                              {skill}
                            </span>
                          ))}
                          {skillsArray.length > 4 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium text-text-muted">
                              +{skillsArray.length - 4} more
                            </span>
                          )}
                        </div>
                      )}
                      <p className="text-[11px] text-text-muted mt-2">
                        Saved {formatDate(bookmark.savedAt)}
                      </p>
                    </div>
                  </button>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(bookmark.seekerUid, bookmark.seekerName)}
                    className="p-2 rounded-xl text-text-muted hover:text-error hover:bg-error-muted transition-colors flex-shrink-0"
                    title="Remove from saved"
                  >
                    <X size={24} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
      </AnimatedPage>
    </div>
  );
}
