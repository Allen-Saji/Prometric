import { getUserProfile, saveUserProfile } from "./firestore";

const MAX_HEARTS = 5;
const REGEN_MS = 60 * 60 * 1000; // 1 hour

export function getHearts(): { hearts: number; nextRegenAt: number | null } {
  const profile = getUserProfile();
  if (!profile) return { hearts: MAX_HEARTS, nextRegenAt: null };

  let hearts = profile.hearts ?? MAX_HEARTS;
  const lastRegen = profile.heartsLastRegen ?? Date.now();

  if (hearts < MAX_HEARTS) {
    const elapsed = Date.now() - lastRegen;
    const regenCount = Math.floor(elapsed / REGEN_MS);
    if (regenCount > 0) {
      hearts = Math.min(MAX_HEARTS, hearts + regenCount);
      profile.hearts = hearts;
      profile.heartsLastRegen = lastRegen + regenCount * REGEN_MS;
      saveUserProfile(profile);
    }
  }

  const nextRegenAt = hearts < MAX_HEARTS
    ? (profile.heartsLastRegen ?? Date.now()) + REGEN_MS
    : null;

  return { hearts, nextRegenAt };
}

export function loseHeart(): number {
  const profile = getUserProfile();
  if (!profile) return MAX_HEARTS;

  const { hearts } = getHearts();
  const newHearts = Math.max(0, hearts - 1);
  profile.hearts = newHearts;
  if (newHearts < MAX_HEARTS && (!profile.heartsLastRegen || profile.hearts === hearts)) {
    profile.heartsLastRegen = Date.now();
  }
  saveUserProfile(profile);
  return newHearts;
}

export function hasHearts(): boolean {
  return getHearts().hearts > 0;
}

export function getTimeUntilNextHeart(): number {
  const { nextRegenAt } = getHearts();
  if (!nextRegenAt) return 0;
  return Math.max(0, nextRegenAt - Date.now());
}

export { MAX_HEARTS };
