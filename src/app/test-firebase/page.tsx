'use client';

import React, { useState } from 'react';
import { db, auth } from '@/config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function TestFirebasePage() {
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLog((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const runTest = async () => {
    setLog([]);

    // Step 1: Check Firebase config
    addLog('🔍 Checking Firebase config...');
    addLog(`  Project ID: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'NOT SET'}`);
    addLog(`  Auth Domain: ${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'NOT SET'}`);
    addLog(`  API Key: ${process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ NOT SET'}`);

    // Step 2: Check auth state
    addLog('🔍 Checking auth state...');
    const user = auth.currentUser;
    if (user) {
      addLog(`  ✅ Logged in as: ${user.email} (UID: ${user.uid})`);
    } else {
      addLog('  ❌ Not logged in — sign in first, then come back here');
      return;
    }

    // Step 3: Try to READ from Firestore
    addLog('📖 Testing Firestore READ (careers collection)...');
    try {
      const careersSnap = await getDoc(doc(db, 'careers', 'data-analyst'));
      if (careersSnap.exists()) {
        addLog('  ✅ Read success! Got career document.');
      } else {
        addLog('  ⚠️ Read returned empty (document may not exist).');
      }
    } catch (readErr: any) {
      addLog(`  ❌ Read FAILED: ${readErr.code || ''} ${readErr.message}`);
    }

    // Step 4: Try to READ user profile
    addLog(`📖 Testing Firestore READ (users/${user.uid})...`);
    try {
      const userSnap = await getDoc(doc(db, 'users', user.uid));
      if (userSnap.exists()) {
        addLog(`  ✅ User profile found! Role: ${userSnap.data()?.role || 'unknown'}`);
      } else {
        addLog('  ⚠️ User profile NOT found in Firestore.');
      }
    } catch (readErr: any) {
      addLog(`  ❌ User read FAILED: ${readErr.code || ''} ${readErr.message}`);
    }

    // Step 5: Try to WRITE to Firestore
    addLog(`✏️ Testing Firestore WRITE (users/${user.uid}/test_write/ping)...`);
    try {
      await setDoc(doc(db, 'users', user.uid, 'test_write', 'ping'), {
        timestamp: Date.now(),
        source: 'web-diagnostic',
      });
      addLog('  ✅ Write SUCCESS! Firestore is working.');
    } catch (writeErr: any) {
      addLog(`  ❌ Write FAILED: ${writeErr.code || ''} ${writeErr.message}`);
    }

    addLog('');
    addLog('🏁 Test complete.');
  };

  return (
    <div style={{ padding: 32, fontFamily: 'monospace', background: '#0a0f1c', color: '#e0e0e0', minHeight: '100vh' }}>
      <h1 style={{ color: '#27ae60', marginBottom: 16 }}>Firebase Diagnostic</h1>
      <button
        onClick={runTest}
        style={{
          padding: '12px 24px',
          background: '#27ae60',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          fontSize: 16,
          fontWeight: 'bold',
          marginBottom: 24,
        }}
      >
        Run Test
      </button>
      <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
        {log.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    </div>
  );
}
