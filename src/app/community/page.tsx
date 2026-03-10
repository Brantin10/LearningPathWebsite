'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getCommunityPosts } from '@/services/firestore';
import { CommunityPost } from '@/types';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Avatar from '@/components/Avatar';

const CATEGORIES = [
  'All',
  'General',
  'Coding',
  'Cloud / DevOps',
  'AI / Machine Learning',
  'Management',
  'Sales / Consulting',
  'Creative / Design',
  'Healthcare',
  'Education',
];

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

export default function CommunityPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getCommunityPosts(category === 'All' ? undefined : category)
      .then((p) => setPosts(p))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
      <Navbar />
      <main className="max-w-3xl mx-auto px-5 pt-4 pb-10">
        <PageHeader title="Community" subtitle="Discuss, share, and learn together" />

        {/* Category Filter Chips */}
        <div className="flex gap-2 overflow-x-auto mb-4 pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                category === cat
                  ? 'bg-primary text-white'
                  : 'glass-card text-text-secondary hover:text-text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* New Post Button */}
        <Button
          title="+ New Post"
          onPress={() => router.push('/community-new')}
          variant="outline"
          className="w-full mb-4"
        />

        {/* Posts List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="flex gap-1">
              <span className="typing-dot w-3 h-3 rounded-full bg-primary" />
              <span className="typing-dot w-3 h-3 rounded-full bg-primary" />
              <span className="typing-dot w-3 h-3 rounded-full bg-primary" />
            </div>
          </div>
        ) : posts.length === 0 ? (
          <Card>
            <p className="text-text-secondary text-center">
              No posts yet. Be the first to start a discussion!
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <Card
                key={post.id}
                onClick={() => router.push(`/community-post?postId=${post.id}`)}
                className="cursor-pointer"
              >
                {/* Author Row */}
                <div className="flex items-center gap-3 mb-3">
                  <Avatar index={post.authorAvatar} size={36} />
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

                {/* Title & Body Preview */}
                <h3 className="text-[15px] font-semibold text-text-primary mb-1">{post.title}</h3>
                <p className="text-sm text-text-secondary line-clamp-2">{post.body}</p>

                {/* Stats Row */}
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
                  <span className="flex items-center gap-1 text-xs text-text-muted">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    {post.upvotes}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-text-muted">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {post.replyCount}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
