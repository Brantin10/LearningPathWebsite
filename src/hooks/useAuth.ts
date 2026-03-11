import { useState, useEffect, useRef } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange } from '../services/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const resolved = useRef(false);

  useEffect(() => {
    // Safety timeout: if Firebase never responds, stop loading after 5s
    const timeout = setTimeout(() => {
      if (!resolved.current) {
        resolved.current = true;
        setLoading(false);
      }
    }, 5000);

    const unsub = onAuthChange((u) => {
      resolved.current = true;
      setUser(u);
      setLoading(false);
      clearTimeout(timeout);
    });

    return () => {
      unsub();
      clearTimeout(timeout);
    };
  }, []);

  return { user, loading, isLoggedIn: !!user };
}
