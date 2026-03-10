'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getApplications, updateApplication, deleteApplication } from '@/services/firestore';
import { JobApplication, ApplicationStatus } from '@/types';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Button from '@/components/Button';
import TextArea from '@/components/TextArea';

const STATUSES: ApplicationStatus[] = ['saved', 'applied', 'phone_screen', 'interview', 'offer', 'rejected'];

function ApplicationDetailContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const appId = params.get('id') || '';
  const [app, setApp] = useState<JobApplication | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getApplications(user.uid).then((apps) => {
      const found = apps.find((a) => a.id === appId);
      if (found) { setApp(found); setNotes(found.notes || ''); }
      setLoading(false);
    });
  }, [user, appId]);

  const handleStatusChange = async (status: ApplicationStatus) => {
    if (!user || !app) return;
    await updateApplication(user.uid, app.id, { status, lastUpdated: Date.now() });
    setApp({ ...app, status });
  };

  const handleSaveNotes = async () => {
    if (!user || !app) return;
    await updateApplication(user.uid, app.id, { notes, lastUpdated: Date.now() });
    alert('Notes saved!');
  };

  const handleDelete = async () => {
    if (!user || !app || !confirm('Delete this application?')) return;
    await deleteApplication(user.uid, app.id);
    router.push('/application-tracker');
  };

  if (loading) return <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated flex items-center justify-center"><div className="flex gap-1"><span className="typing-dot w-3 h-3 rounded-full bg-primary" /><span className="typing-dot w-3 h-3 rounded-full bg-primary" /><span className="typing-dot w-3 h-3 rounded-full bg-primary" /></div></div>;
  if (!app) return <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated"><Navbar /><main className="max-w-2xl mx-auto px-5 pt-4"><PageHeader title="Application Not Found" /></main></div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
      <Navbar />
      <main className="max-w-2xl mx-auto px-5 pt-4 pb-10">
        <PageHeader title={app.position} subtitle={app.company} />

        <Card className="mb-4">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">Status</h3>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <button key={s} onClick={() => handleStatusChange(s)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${app.status === s ? 'bg-primary-muted border-[rgba(39,174,96,0.4)] text-primary' : 'glass-card text-text-secondary hover:text-text-primary'}`}>
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </Card>

        {app.url && (
          <Card className="mb-4">
            <a href={app.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-sm">View Application &rarr;</a>
          </Card>
        )}

        <TextArea label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add notes about this application..." />
        <Button title="Save Notes" onPress={handleSaveNotes} variant="outline" className="w-full mb-4" />
        <button onClick={handleDelete} className="w-full text-center text-error text-sm hover:underline">Delete Application</button>
      </main>
    </div>
  );
}

export default function ApplicationDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated" />}>
      <ApplicationDetailContent />
    </Suspense>
  );
}
