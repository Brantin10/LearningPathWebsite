'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp } from '@/services/auth';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState<'seeker' | 'employer'>('seeker');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email.trim() || !password || !confirm) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signUp(email.trim(), password, role);
      if (role === 'seeker') {
        router.replace('/questionnaire');
      } else {
        router.replace('/employer-home');
      }
    } catch (e: any) {
      const msg = e.code === 'auth/email-already-in-use'
        ? 'This email is already registered.'
        : e.message || 'Sign up failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Create Account</h1>
        <p className="text-text-secondary mb-8">Start your career journey today</p>

        {error && (
          <div className="bg-error-muted border border-[rgba(255,107,107,0.4)] rounded-xl p-3 mb-4">
            <p className="text-error text-sm">{error}</p>
          </div>
        )}

        {/* Role selection */}
        <div className="mb-6">
          <label className="block text-[11px] font-semibold text-text-secondary mb-2 tracking-[1.5px] uppercase">
            I am a
          </label>
          <div className="flex gap-3">
            {(['seeker', 'employer'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`
                  flex-1 py-3 rounded-xl text-sm font-semibold transition-colors border
                  ${role === r
                    ? 'bg-primary-muted border-[rgba(39,174,96,0.4)] text-primary'
                    : 'glass-card text-text-secondary hover:text-text-primary'
                  }
                `}
              >
                {r === 'seeker' ? 'Job Seeker' : 'Employer'}
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <Input
          label="Password"
          type="password"
          placeholder="Min 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Repeat your password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
        />

        <Button title="Create Account" onPress={handleSignup} loading={loading} className="w-full mt-2" />

        <p className="text-center mt-6 text-text-secondary text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-accent hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
