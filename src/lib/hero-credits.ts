import { getUserProfile, saveUserProfile } from "./firestore";

const HC_LOG_KEY = "hc-log";

interface HCLogEntry {
  amount: number;
  reason: string;
  timestamp: number;
}

// HC earning amounts
export const HC_REWARDS = {
  DAILY_PASS: 5,
  DUEL_WIN: 3,
  STREAK_7_DAY: 5,
} as const;

// HC spending amounts
export const HC_COSTS = {
  MILESTONE_MOCK: 10,
  FINAL_BOSS: 20,
} as const;

export function getHC(): number {
  const profile = getUserProfile();
  return profile?.heroCredits || 0;
}

export function addHC(amount: number, reason: string): number {
  const profile = getUserProfile();
  if (!profile) return 0;
  profile.heroCredits = (profile.heroCredits || 0) + amount;
  saveUserProfile(profile);

  // Log the transaction
  const log = getHCLog();
  log.push({ amount, reason, timestamp: Date.now() });
  localStorage.setItem(HC_LOG_KEY, JSON.stringify(log));

  return profile.heroCredits;
}

export function spendHC(amount: number, reason: string): boolean {
  const profile = getUserProfile();
  if (!profile) return false;
  const current = profile.heroCredits || 0;
  if (current < amount) return false;

  profile.heroCredits = current - amount;
  saveUserProfile(profile);

  const log = getHCLog();
  log.push({ amount: -amount, reason, timestamp: Date.now() });
  localStorage.setItem(HC_LOG_KEY, JSON.stringify(log));

  return true;
}

export function getMockTestTokens(): number {
  const profile = getUserProfile();
  return profile?.mockTestTokens || 0;
}

export function useMockTestToken(): boolean {
  const profile = getUserProfile();
  if (!profile) return false;
  const tokens = profile.mockTestTokens || 0;
  if (tokens <= 0) return false;
  profile.mockTestTokens = tokens - 1;
  saveUserProfile(profile);
  return true;
}

function getHCLog(): HCLogEntry[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(HC_LOG_KEY);
  return data ? JSON.parse(data) : [];
}
