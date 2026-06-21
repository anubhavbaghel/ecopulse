import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserProfile, OnboardingAnswers } from '@/types/user';
import { DEFAULT_DAILY_TARGET_KG } from '@/lib/constants';

// Create or fetch user profile doc
export const upsertUserProfile = async (
  uid: string,
  email: string,
  displayName: string,
  photoURL?: string
): Promise<UserProfile> => {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return snap.data() as UserProfile;
  }

  const profile: UserProfile = {
    uid,
    email,
    displayName,
    photoURL: photoURL || '',
    dailyTargetKg: DEFAULT_DAILY_TARGET_KG,
    baselineCo2Kg: DEFAULT_DAILY_TARGET_KG,
    onboardingComplete: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(ref, profile);
  return profile;
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
};

export const completeOnboarding = async (
  uid: string,
  answers: OnboardingAnswers,
  archetypeName: string,
  archetypeDescription: string,
  dailyCo2Kg: number,
  topCategory: string
): Promise<void> => {
  const ref = doc(db, 'users', uid);
  // Use setDoc with merge so this works even if the user profile wasn't created yet
  await setDoc(
    ref,
    {
      mobility: answers.mobility,
      diet: answers.diet,
      homeSize: answers.homeSize,
      renewable: answers.renewable,
      archetype: archetypeName,
      archetypeDescription,
      baselineCo2Kg: dailyCo2Kg,
      dailyTargetKg: dailyCo2Kg,
      topCategory,
      onboardingComplete: true,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
};

export const updateDailyTarget = async (uid: string, targetKg: number): Promise<void> => {
  await updateDoc(doc(db, 'users', uid), {
    dailyTargetKg: targetKg,
    updatedAt: new Date().toISOString(),
  });
};
