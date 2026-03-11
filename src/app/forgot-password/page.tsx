'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { resetPassword } from '@/services/auth';
import Input from '@/components/Input';
import Button from '@/components/Button';
import AnimatedPage from '@/components/AnimatedPage';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (e: any) {
      setError(e.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated flex items-center justify-center px-6">
        <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Reset Password</h1>
        <p className="text-text-secondary mb-8">
          {sent ? 'Check your inbox for reset instructions.' : 'Enter your email to receive a reset link.'}
        </p>

        {error && (
          <div className="bg-error-muted border border-[rgba(255,107,107,0.4)] rounded-xl p-3 mb-4">
            <p className="text-error text-sm">{error}</p>
          </div>
        )}

        {sent ? (
          <div className="glass-card rounded-xl p-6 text-center">
            <p className="text-4xl mb-4">&#9993;</p>
            <p className="text-text-primary font-semibold mb-2">Email Sent!</p>
            <p className="text-text-secondary text-sm mb-6">
              We&apos;ve sent password reset instructions to <strong className="text-accent">{email}</strong>
            </p>
            <Link href="/login" className="text-accent hover:underline text-sm">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button title="Send Reset Link" onPress={handleReset} loading={loading} className="w-full mt-2" />
            <p className="text-center mt-6 text-text-secondary text-sm">
              <Link href="/login" className="text-accent hover:underline">Back to Sign In</Link>
            </p>
          </>
        )}
      </div>
    </div>
    </AnimatedPage>
  );
}
