'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import {
  getCommunityPost,
  getPostReplies,
  addPostReply,
  togglePostUpvote,
  toggleReplyUpvote,
  reportPost,
  reportReply,
} from '@/services/firestore';
import { CommunityPost, CommunityReply } from '@/types';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Avatar from '@/components/Avatar';

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function CommunityPostContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get('postId') || '';
  const { user } = useAuth();
  const { profile } = useUser();

  const [post, setPost] = useState<CommunityPost | null>(null);
  const [replies, setReplies] = useState<CommunityReply[]>([]);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!postId) return;
    Promise.all([getCommunityPost(postId), getPostReplies(postId)])
      .then(([p, r]) => {
        setPost(p);
        setReplies(r);
      })
      .finally(() => setLoading(false));
  }, [postId]);

  const handleUpvotePost = async () => {
    if (!user || !post) return;
    const alreadyUpvoted = post.upvotedBy.includes(user.uid);
    // Optimistic update
    setPost({
      ...post,
      upvotes: alreadyUpvoted ? post.upvotes - 1 : post.upvotes + 1,
      upvotedBy: alreadyUpvoted
        ? post.upvotedBy.filter((id) => id !== user.uid)
        : [...post.upvotedBy, user.uid],
    });
    await togglePostUpvote(postId, user.uid);
  };

  const handleUpvoteReply = async (reply: CommunityReply) => {
    if (!user) return;
    const alreadyUpvoted = reply.upvotedBy.includes(user.uid);
    // Optimistic update
    setReplies((prev) =>
      prev.map((r) =>
        r.id === reply.id
          ? {
              ...r,
              upvotes: alreadyUpvoted ? r.upvotes - 1 : r.upvotes + 1,
              upvotedBy: alreadyUpvoted
                ? r.upvotedBy.filter((id) => id !== user.uid)
                : [...r.upvotedBy, user.uid],
            }
          : r,
      ),
    );
    await toggleReplyUpvote(postId, reply.id, user.uid);
  };

  const handleReportPost = async () => {
    if (!user || !post) return;
    if (!window.confirm('Are you sure you want to report this post?')) return;
    await reportPost(postId, user.uid);
    window.alert('Post reported. Thank you.');
  };

  const handleReportReply = async (replyId: string) => {
    if (!user) return;
    if (!window.confirm('Are you sure you want to report this reply?')) return;
    await reportReply(postId, replyId, user.uid);
    window.alert('Reply reported. Thank you.');
  };

  const handleSendReply = async () => {
    if (!user || !profile || replyText.trim().length === 0) return;
    setSending(true);
    try {
      const newReply: Omit<CommunityReply, 'id'> = {
        body: replyText.trim(),
        authorUid: user.uid,
        authorName: profile.username || 'Anonymous',
        authorAvatar: profile.avatar || 0,
        createdAt: Date.now(),
        upvotes: 0,
        upvotedBy: [],
        reported: false,
        reportedBy: [],
      };
      const replyId = await addPostReply(postId, newReply);
      setReplies((prev) => [...prev, { id: replyId, ...newReply }]);
      setReplyText('');
      if (post) {
        setPost({ ...post, replyCount: post.replyCount + 1 });
      }
    } catch (err) {
      window.alert('Failed to send reply.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
        <Navbar />
        <main className="max-w-3xl mx-auto px-5 pt-4 pb-10">
          <PageHeader title="Post" />
          <div className="flex justify-center py-20">
            <div className="flex gap-1">
              <span className="typing-dot w-3 h-3 rounded-full bg-primary" />
              <span className="typing-dot w-3 h-3 rounded-full bg-primary" />
              <span className="typing-dot w-3 h-3 rounded-full bg-primary" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
        <Navbar />
        <main className="max-w-3xl mx-auto px-5 pt-4 pb-10">
          <PageHeader title="Post" />
          <Card>
            <p className="text-text-secondary text-center">Post not found.</p>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
      <Navbar />
      <main className="max-w-3xl mx-auto px-5 pt-4 pb-10">
        <PageHeader title="Post" />

        {/* Post Content */}
        <Card className="mb-4">
          {/* Author Row */}
          <div className="flex items-center gap-3 mb-4">
            <Avatar index={post.authorAvatar} size={40} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary truncate">
                {post.authorName}
              </p>
              <p className="text-[11px] text-text-muted">{timeAgo(post.createdAt)}</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-muted text-primary font-semibold whitespace-nowrap">
              {post.category}
            </span>
          </div>

          {/* Title & Body */}
          <h2 className="text-lg font-bold text-text-primary mb-2">{post.title}</h2>
          <p className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">
            {post.body}
          </p>

          {/* Actions Row */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
            <button
              onClick={handleUpvotePost}
              className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                user && post.upvotedBy.includes(user.uid)
                  ? 'text-primary'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <svg className="w-5 h-5" fill={user && post.upvotedBy.includes(user.uid) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              {post.upvotes}
            </button>
            <button
              onClick={handleReportPost}
              className="flex items-center gap-1.5 text-sm text-text-muted hover:text-error transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2z" />
              </svg>
              Report
            </button>
          </div>
        </Card>

        {/* Replies Section */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-text-secondary mb-3">
            Replies ({replies.length})
          </h3>

          {replies.length === 0 ? (
            <Card>
              <p className="text-text-muted text-center text-sm">No replies yet. Be the first!</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {replies.map((reply) => (
                <Card key={reply.id}>
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar index={reply.authorAvatar} size={32} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary truncate">
                        {reply.authorName}
                      </p>
                      <p className="text-[11px] text-text-muted">{timeAgo(reply.createdAt)}</p>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">
                    {reply.body}
                  </p>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
                    <button
                      onClick={() => handleUpvoteReply(reply)}
                      className={`flex items-center gap-1 text-xs font-semibold transition-colors ${
                        user && reply.upvotedBy.includes(user.uid)
                          ? 'text-primary'
                          : 'text-text-muted hover:text-text-primary'
                      }`}
                    >
                      <svg className="w-4 h-4" fill={user && reply.upvotedBy.includes(user.uid) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      {reply.upvotes}
                    </button>
                    <button
                      onClick={() => handleReportReply(reply.id)}
                      className="flex items-center gap-1 text-xs text-text-muted hover:text-error transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2z" />
                      </svg>
                      Report
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Reply Input */}
        <div className="glass-card rounded-2xl p-4 flex gap-3 items-end">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            rows={2}
            className="flex-1 glass-input rounded-xl px-3 py-2 text-sm text-text-primary placeholder:text-text-muted resize-none min-h-[44px]"
          />
          <button
            onClick={handleSendReply}
            disabled={sending || replyText.trim().length === 0}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0 ${
              sending || replyText.trim().length === 0
                ? 'bg-bg-card-hover text-text-muted cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary-dark cursor-pointer'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </main>
    </div>
  );
}

export default function CommunityPostPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated" />}>
      <CommunityPostContent />
    </Suspense>
  );
}
