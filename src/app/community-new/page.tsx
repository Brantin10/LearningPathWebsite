'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { createCommunityPost } from '@/services/firestore';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import Input from '@/components/Input';
import TextArea from '@/components/TextArea';
import Button from '@/components/Button';

const CATEGORIES = [
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

export default function CommunityNewPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile } = useUser();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('General');
  const [posting, setPosting] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; body?: string }>({});

  const validate = (): boolean => {
    const newErrors: { title?: string; body?: string } = {};
    if (title.trim().length < 3) newErrors.title = 'Title must be at least 3 characters';
    if (body.trim().length < 10) newErrors.body = 'Body must be at least 10 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePost = async () => {
    if (!validate() || !user || !profile) return;
    setPosting(true);
    try {
      await createCommunityPost({
        title: title.trim(),
        body: body.trim(),
        authorUid: user.uid,
        authorName: profile.username || 'Anonymous',
        authorAvatar: profile.avatar || 0,
        category,
        createdAt: Date.now(),
        upvotes: 0,
        upvotedBy: [],
        replyCount: 0,
        reported: false,
        reportedBy: [],
      });
      router.push('/community');
    } catch (err) {
      window.alert('Failed to create post. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
      <Navbar />
      <main className="max-w-2xl mx-auto px-5 pt-4 pb-10">
        <PageHeader title="New Post" subtitle="Share with the community" />

        {/* Title Input */}
        <Input
          label="Title"
          placeholder="What's on your mind?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
        />

        {/* Body Textarea */}
        <TextArea
          label="Body"
          placeholder="Share your thoughts, questions, or experiences..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          error={errors.body}
        />

        {/* Category Selector */}
        <label className="block text-[11px] font-semibold text-text-secondary mb-2 tracking-[1.5px] uppercase">
          Category
        </label>
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                category === cat
                  ? 'bg-primary text-white'
                  : 'glass-card text-text-secondary hover:text-text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            title="Cancel"
            onPress={() => router.back()}
            variant="outline"
            className="flex-1"
          />
          <Button
            title="Post"
            onPress={handlePost}
            loading={posting}
            disabled={posting}
            className="flex-1"
          />
        </div>
      </main>
    </div>
  );
}
