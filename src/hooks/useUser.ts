import { useState, useEffect } from 'react';
import { AppUser } from '../types';
import { onUserSnapshot } from '../services/firestore';
import { useAuth } from './useAuth';

export function useUser() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const unsub = onUserSnapshot(user.uid, (p) => {
      setProfile(p);
      setLoading(false);
    });

    return unsub;
  }, [user?.uid]);

  return { profile, loading };
}
