import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange, getCurrentUser } from '@/lib/firebase-utils';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set initial user state
    setUser(getCurrentUser());
    setLoading(false);

    // Listen for auth state changes
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}

