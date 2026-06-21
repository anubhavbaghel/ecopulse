'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/lib/stores/authStore';
import { upsertUserProfile } from '@/lib/firestore/users';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setProfile, setLoading, reset } = useAuthStore();
  const [initError, setInitError] = useState(false);

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
          setInitError(true);
        }
      } else {
        reset();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [reset, setLoading, setProfile, setUser]);

  if (initError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="text-center space-y-4">
          <p className="text-[#d93025] font-medium">
            Failed to load your profile. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-sm font-medium text-white rounded"
            style={{ background: '#1a73e8' }}
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
