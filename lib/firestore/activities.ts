import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ActivityEntry, ActivityInput } from '@/types/activity';
import { calculateCo2 } from '@/lib/emission-factors';

const activitiesRef = (uid: string) =>
  collection(db, 'users', uid, 'activities');

// Today's date string YYYY-MM-DD
export const todayString = (): string => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

export const addActivity = async (
  uid: string,
  input: ActivityInput
): Promise<ActivityEntry> => {
  const co2eKg = calculateCo2(input.activityType, input.quantity);
  const now = new Date().toISOString();
  const date = todayString();

  const data = {
    userId: uid,
    category: input.category,
    activityType: input.activityType,
    label: input.label,
    quantity: input.quantity,
    unit: input.unit,
    co2eKg,
    date,
    createdAt: now,
  };

  const docRef = await addDoc(activitiesRef(uid), data);
  return { id: docRef.id, ...data };
};

export const deleteActivity = async (uid: string, activityId: string): Promise<void> => {
  await deleteDoc(doc(db, 'users', uid, 'activities', activityId));
};

export const getTodayActivities = async (uid: string): Promise<ActivityEntry[]> => {
  const date = todayString();
  const q = query(
    activitiesRef(uid),
    where('date', '==', date),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ActivityEntry));
};

export const getWeeklyActivities = async (uid: string): Promise<ActivityEntry[]> => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  const cutoff = sevenDaysAgo.toISOString().split('T')[0];

  const q = query(
    activitiesRef(uid),
    where('date', '>=', cutoff),
    orderBy('date', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ActivityEntry));
};

// Aggregate weekly data as an array of 7 daily totals (oldest first)
export const getWeeklyDailyTotals = async (uid: string): Promise<number[]> => {
  const activities = await getWeeklyActivities(uid);
  const totals: Record<string, number> = {};

  for (const a of activities) {
    totals[a.date] = (totals[a.date] || 0) + a.co2eKg;
  }

  const result: number[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    result.push(totals[dateStr] || 0);
  }
  return result;
};
