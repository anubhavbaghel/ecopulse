export type MobilityType = 'car' | 'transit' | 'bike' | 'mix';
export type DietType = 'meat-heavy' | 'balanced' | 'plant-based' | 'vegan';
export type HomeSizeType = 'studio' | 'small' | 'medium' | 'large';
export type CategoryType = 'transport' | 'diet' | 'utilities' | 'shopping';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  archetype?: string;
  archetypeDescription?: string;
  dailyTargetKg: number;
  baselineCo2Kg: number;
  onboardingComplete: boolean;
  topCategory?: CategoryType;
  mobility?: MobilityType;
  diet?: DietType;
  homeSize?: HomeSizeType;
  renewable?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingAnswers {
  mobility: MobilityType;
  diet: DietType;
  homeSize: HomeSizeType;
  renewable: boolean;
}
