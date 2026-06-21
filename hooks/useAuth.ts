'use client';

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/lib/stores/authStore';
import { upsertUserProfile, getUserProfile } from '@/lib/firestore/users';

/**
 * Subscribes to Firebase Auth state changes and syncs with Zustand store.
 * Call this once at the top of the component tree (AuthGuard).
 */
export const useAuth = () => {
  const { user, profile, loading, setUser, setProfile, setLoading, reset } =
    useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          // Fetch or create profile in Firestore
          const prof = await upsertUserProfile(
            firebaseUser.uid,
            firebaseUser.email ?? '',
            firebaseUser.displayName ?? 'EcoPulse User',
            firebaseUser.photoURL ?? undefined
          );
          setProfile(prof);
        } catch (err) {
          console.error('Failed to load user profile:', err);
        }
      } else {
        reset();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, profile, loading };
};
