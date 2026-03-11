import { useState, useEffect, useRef } from 'react';
import { AppUser } from '../types';
import { onUserSnapshot } from '../services/firestore';
import { useAuth } from './useAuth';

export function useUser() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const resolved = useRef(false);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      resolved.current = false;
      return;
    }

    resolved.current = false;

    // Safety timeout: if Firestore never responds (not connected, rules block, etc.)
    const timeout = setTimeout(() => {
      if (!resolved.current) {
        resolved.current = true;
        setLoading(false);
      }
    }, 4000);

    let unsub: (() => void) | undefined;
    try {
      unsub = onUserSnapshot(user.uid, (p) => {
        resolved.current = true;
        setProfile(p);
        setLoading(false);
        clearTimeout(timeout);
      });
    } catch {
      // Firestore not configured — stop loading so the app still works
      resolved.current = true;
      setLoading(false);
      clearTimeout(timeout);
    }

    return () => {
      unsub?.();
      clearTimeout(timeout);
    };
  }, [user?.uid]);

  return { profile, loading };
}
