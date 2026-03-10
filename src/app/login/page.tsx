'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from '@/services/auth';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      router.replace('/home');
    } catch (e: any) {
      const msg = e.code === 'auth/invalid-credential'
        ? 'Invalid email or password.'
        : e.code === 'auth/too-many-requests'
          ? 'Too many attempts. Please try again later.'
          : e.message || 'Login failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Welcome Back</h1>
        <p className="text-text-secondary mb-8">Sign in to continue your career journey</p>

        {error && (
          <div className="bg-error-muted border border-[rgba(255,107,107,0.4)] rounded-xl p-3 mb-4">
            <p className="text-error text-sm">{error}</p>
          </div>
        )}

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
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        <Button title="Sign In" onPress={handleLogin} loading={loading} className="w-full mt-2" />

        <div className="flex justify-between mt-6 text-sm">
          <Link href="/forgot-password" className="text-accent hover:underline">
            Forgot Password?
          </Link>
          <Link href="/signup" className="text-accent hover:underline">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
