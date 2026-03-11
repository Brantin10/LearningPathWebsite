'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getApplications } from '@/services/firestore';
import { JobApplication, ApplicationStatus } from '@/types';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { PageSkeleton } from '@/components/Skeleton';
import AnimatedPage from '@/components/AnimatedPage';
import EmptyState from '@/components/EmptyState';
import StaggerList, { StaggerItem } from '@/components/StaggerList';

const STATUS_LABELS: Record<ApplicationStatus, string> = { saved: 'Saved', applied: 'Applied', phone_screen: 'Phone Screen', interview: 'Interview', offer: 'Offer', rejected: 'Rejected' };
const STATUS_COLORS: Record<ApplicationStatus, string> = { saved: 'bg-bg-card-hover text-text-secondary', applied: 'bg-primary-muted text-primary', phone_screen: 'bg-accent-muted text-accent', interview: 'bg-accent-muted text-accent', offer: 'bg-primary text-white', rejected: 'bg-error-muted text-error' };

export default function ApplicationTrackerPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [apps, setApps] = useState<JobApplication[]>([]);
  const [filter, setFilter] = useState<ApplicationStatus | 'all'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) getApplications(user.uid).then((a) => { setApps(a.sort((x, y) => y.lastUpdated - x.lastUpdated)); setLoading(false); }); }, [user]);

  const filtered = filter === 'all' ? apps : apps.filter((a) => a.status === filter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
      <Navbar />
      <AnimatedPage>
        <main className="max-w-3xl mx-auto px-5 pt-4 pb-10">
          <PageHeader title="Applications" subtitle={`${apps.length} total`} />

        <div className="flex gap-2 overflow-x-auto mb-4 pb-2">
          {(['all' as const, ...Object.keys(STATUS_LABELS) as ApplicationStatus[]]).map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${filter === s ? 'bg-primary text-white' : 'glass-card text-text-secondary hover:text-text-primary'}`}>
              {s === 'all' ? 'All' : STATUS_LABELS[s as ApplicationStatus]}
            </button>
          ))}
        </div>

        <Button title="+ Add Application" onPress={() => router.push('/application-add')} variant="outline" className="w-full mb-4" />

        {loading ? <PageSkeleton />
        : filtered.length === 0 ? <EmptyState icon="📋" title="No Applications" description="No applications yet." actionLabel="+ Add Application" onAction={() => router.push('/application-add')} />
        : <StaggerList className="space-y-3">{filtered.map((app) => (
            <StaggerItem key={app.id}>
              <Card onClick={() => router.push(`/application-detail?id=${app.id}`)} className="cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[15px] font-semibold text-text-primary">{app.position}</h3>
                    <p className="text-sm text-text-secondary">{app.company}</p>
                  </div>
                  <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${STATUS_COLORS[app.status]}`}>{STATUS_LABELS[app.status]}</span>
                </div>
                <p className="text-xs text-text-muted mt-2">{new Date(app.dateApplied).toLocaleDateString()}</p>
              </Card>
            </StaggerItem>
          ))}</StaggerList>}
      </main>
      </AnimatedPage>
    </div>
  );
}
