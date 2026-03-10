'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { updateUser } from '@/services/firestore';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import Avatar from '@/components/Avatar';

export default function AvatarPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile } = useUser();

  const handleSelect = async (index: number) => {
    if (!user) return;
    try {
      await updateUser(user.uid, { avatar: index });
      router.back();
    } catch (e: any) {
      alert(e.message || 'Failed to update avatar.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
      <Navbar />
      <main className="max-w-2xl mx-auto px-5 pt-4 pb-10">
        <PageHeader title="Choose Avatar" subtitle="Pick a profile picture" />

        <div className="flex justify-center mb-8">
          <Avatar index={profile?.avatar ?? 0} size={120} />
        </div>

        <div className="grid grid-cols-5 gap-4 max-w-xs mx-auto">
          {Array.from({ length: 10 }, (_, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`rounded-full transition-all ${
                profile?.avatar === i ? 'ring-2 ring-primary ring-offset-2 ring-offset-bg scale-110' : 'hover:scale-105'
              }`}
            >
              <Avatar index={i} size={56} />
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
