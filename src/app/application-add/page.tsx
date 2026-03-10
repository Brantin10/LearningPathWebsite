'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { addApplication } from '@/services/firestore';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import Input from '@/components/Input';
import TextArea from '@/components/TextArea';
import Button from '@/components/Button';

export default function ApplicationAddPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user || !company.trim() || !position.trim()) { alert('Company and position are required.'); return; }
    setLoading(true);
    try {
      await addApplication(user.uid, { company: company.trim(), position: position.trim(), status: 'applied', dateApplied: Date.now(), notes, url, source: 'manual', lastUpdated: Date.now() });
      router.push('/application-tracker');
    } catch (e: any) {
      alert(e.message || 'Failed to add application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
      <Navbar />
      <main className="max-w-2xl mx-auto px-5 pt-4 pb-10">
        <PageHeader title="Add Application" />
        <Input label="Company" placeholder="Company name" value={company} onChange={(e) => setCompany(e.target.value)} />
        <Input label="Position" placeholder="Job title" value={position} onChange={(e) => setPosition(e.target.value)} />
        <Input label="URL" placeholder="Application link (optional)" value={url} onChange={(e) => setUrl(e.target.value)} />
        <TextArea label="Notes" placeholder="Add any notes..." value={notes} onChange={(e) => setNotes(e.target.value)} />
        <Button title="Save Application" onPress={handleSubmit} loading={loading} className="w-full" />
      </main>
    </div>
  );
}
