'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import Image from 'next/image';
import Button from '@/components/Button';
import { PageSkeleton } from '@/components/Skeleton';
import AnimatedPage from '@/components/AnimatedPage';

export default function SplashPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { profile } = useUser();

  useEffect(() => {
    if (!loading && user && profile) {
      if (profile.role === 'employer') {
        router.replace('/employer-home');
      } else {
        router.replace('/home');
      }
    }
  }, [user, loading, profile, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
        <PageSkeleton />
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
        <PageSkeleton />
      </div>
    );
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full flex flex-col items-center text-center">
        <Image src="/logo.png" alt="My Future Career" width={120} height={120} className="mb-8" />
        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">My Future Career</h1>
        <p className="text-text-secondary text-lg mb-12">
          Your AI-powered guide to finding and building your dream career
        </p>

        <div className="w-full flex flex-col gap-3">
          <Button
            title="Get Started"
            onPress={() => router.push('/onboarding')}
            variant="primary"
          />
          <Button
            title="Sign In"
            onPress={() => router.push('/login')}
            variant="outline"
          />
        </div>
      </div>
    </div>
    </AnimatedPage>
  );
}
