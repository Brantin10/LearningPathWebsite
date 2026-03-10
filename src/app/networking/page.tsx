'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import {
  getNetworkingForCategory,
  mapCareerToNetworkingCategory,
} from '@/data/networkingResources';
import { NetworkingCategory, NetworkingResource } from '@/types';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';

const TYPE_BADGES: Record<string, string> = {
  reddit: 'bg-[rgba(255,69,0,0.15)] text-[#ff6b35]',
  discord: 'bg-[rgba(88,101,242,0.15)] text-[#7c8af5]',
  linkedin: 'bg-[rgba(0,119,181,0.15)] text-[#4da3d4]',
  website: 'bg-accent-muted text-accent',
  forum: 'bg-primary-muted text-primary',
};

const BEST_PRACTICES = [
  'Be genuine and curious in every conversation. People can tell when you are only networking for personal gain.',
  'Follow up within 48 hours after meeting someone new. A short thank-you message keeps you top of mind.',
  'Give before you ask. Share useful articles, make introductions, or offer help before requesting favors.',
  'Keep your LinkedIn profile updated and active. Recruiters and peers often check profiles before connecting.',
  'Set a networking goal: aim to reach out to at least one new contact per week to build momentum over time.',
];

export default function NetworkingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile } = useUser();
  const [networkingData, setNetworkingData] = useState<NetworkingCategory | null>(null);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    if (!profile) return;
    const careerCategory = profile.chosenCareer || '';
    const mapped = mapCareerToNetworkingCategory(careerCategory);
    setCategoryName(mapped);
    const data = getNetworkingForCategory(mapped);
    setNetworkingData(data || null);
  }, [profile]);

  const handleOpenLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
      <Navbar />
      <main className="max-w-3xl mx-auto px-5 pt-4 pb-10">
        <PageHeader title="Networking" subtitle="Build your professional network" />

        {/* Category Card */}
        <Card className="mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-muted flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-[15px] font-semibold text-text-primary">
                {categoryName || 'General'}
              </p>
              <p className="text-xs text-text-secondary">
                Resources tailored to your career path
              </p>
            </div>
          </div>
        </Card>

        {!networkingData ? (
          <Card>
            <p className="text-text-secondary text-center">
              Choose a career path to see networking resources.
            </p>
          </Card>
        ) : (
          <>
            {/* Communities */}
            <h2 className="text-lg font-semibold text-text-primary mb-3">Communities</h2>
            <div className="space-y-3 mb-6">
              {networkingData.communities.map((community, idx) => (
                <Card
                  key={idx}
                  onClick={() => handleOpenLink(community.url)}
                  className="cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-[15px] font-semibold text-text-primary truncate">
                          {community.title}
                        </h3>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap capitalize ${
                            TYPE_BADGES[community.type] || TYPE_BADGES.website
                          }`}
                        >
                          {community.type}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary line-clamp-2">
                        {community.description}
                      </p>
                    </div>
                    <svg className="w-4 h-4 text-text-muted shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </Card>
              ))}
            </div>

            {/* Networking Tips */}
            <h2 className="text-lg font-semibold text-text-primary mb-3">Networking Tips</h2>
            <Card className="mb-6">
              <ul className="space-y-3">
                {networkingData.tips.map((tip, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="text-primary font-bold text-sm mt-0.5 shrink-0">
                      {idx + 1}.
                    </span>
                    <p className="text-sm text-text-secondary leading-relaxed">{tip}</p>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Mentorship Advice */}
            <h2 className="text-lg font-semibold text-text-primary mb-3">Mentorship Advice</h2>
            <Card className="mb-6">
              <ul className="space-y-3">
                {networkingData.mentorshipAdvice.map((advice, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="text-accent font-bold text-sm mt-0.5 shrink-0">
                      {idx + 1}.
                    </span>
                    <p className="text-sm text-text-secondary leading-relaxed">{advice}</p>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Best Practices */}
            <h2 className="text-lg font-semibold text-text-primary mb-3">Best Practices</h2>
            <Card>
              <ul className="space-y-3">
                {BEST_PRACTICES.map((practice, idx) => (
                  <li key={idx} className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary-muted flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">{practice}</p>
                  </li>
                ))}
              </ul>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
