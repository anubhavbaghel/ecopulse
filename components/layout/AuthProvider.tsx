'use client';

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/lib/stores/authStore';
import { upsertUserProfile } from '@/lib/firestore/users';

/**
 * Bootstraps Firebase Auth state into Zustand at the app root.
 * Must wrap all pages that need auth access.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setProfile, setLoading, reset } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const prof = await upsertUserProfile(
            firebaseUser.uid,
            firebaseUser.email ?? '',
            firebaseUser.displayName ?? 'EcoPulse User',
            firebaseUser.photoURL ?? undefined
          );
          setProfile(prof);
        } catch (err) {
          console.error('Profile load error:', err);
        }
      } else {
        reset();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return <>{children}</>;
}
