import { XPEvent, UserProfile } from "./types";
import { getUserProfile, saveUserProfile } from "./firestore";

const XP_EVENTS_KEY = "xp-events";

export const LEVELS = [
  { level: 1, title: "Intern", icon: "Plant", minXP: 0, maxXP: 100 },
  { level: 2, title: "Trainee", icon: "BookOpen", minXP: 100, maxXP: 300 },
  { level: 3, title: "Pharmacist", icon: "Pill", minXP: 300, maxXP: 600 },
  { level: 4, title: "Senior RPh", icon: "Lightning", minXP: 600, maxXP: 1000 },
  { level: 5, title: "Specialist", icon: "Medal", minXP: 1000, maxXP: 1500 },
  { level: 6, title: "Expert", icon: "Trophy", minXP: 1500, maxXP: 2200 },
  { level: 7, title: "Master", icon: "Crown", minXP: 2200, maxXP: 3000 },
  { level: 8, title: "Pharma Hero", icon: "Diamond", minXP: 3000, maxXP: Infinity },
];

export function getLevelInfo(xp: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) {
      const current = LEVELS[i];
      const progressInLevel = xp - current.minXP;
      const levelRange = current.maxXP === Infinity ? 1000 : current.maxXP - current.minXP;
      const progress = Math.min((progressInLevel / levelRange) * 100, 100);
      return { ...current, progress, currentXP: xp };
    }
  }
  return { ...LEVELS[0], progress: 0, currentXP: 0 };
}

export function addXP(type: XPEvent["type"], amount: number): XPEvent {
  const event: XPEvent = { type, amount, timestamp: Date.now() };

  // Save event
  const events = getXPEvents();
  events.push(event);
  if (typeof window !== "undefined") {
    localStorage.setItem(XP_EVENTS_KEY, JSON.stringify(events));
  }

  // Update profile
  const profile = getUserProfile();
  if (profile) {
    profile.xp = (profile.xp || 0) + amount;
    profile.level = getLevelInfo(profile.xp).level;
    saveUserProfile(profile);
  }

  return event;
}

export function getXPEvents(): XPEvent[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(XP_EVENTS_KEY);
  return data ? JSON.parse(data) : [];
}

export function getTodayXP(): number {
  const today = new Date().toISOString().split("T")[0];
  const events = getXPEvents();
  return events
    .filter((e) => new Date(e.timestamp).toISOString().split("T")[0] === today)
    .reduce((sum, e) => sum + e.amount, 0);
}

export function awardQuizXP(correct: number, total: number, streak: number): XPEvent[] {
  const events: XPEvent[] = [];

  // Per correct answer
  for (let i = 0; i < correct; i++) {
    events.push(addXP("correct_answer", 10));
  }

  // Daily completion
  events.push(addXP("daily_complete", 50));

  // Perfect score
  if (correct === total) {
    events.push(addXP("perfect_score", 100));
  }

  // Streak bonuses
  if (streak >= 30) events.push(addXP("streak_bonus", 200));
  else if (streak >= 14) events.push(addXP("streak_bonus", 100));
  else if (streak >= 7) events.push(addXP("streak_bonus", 50));
  else if (streak >= 3) events.push(addXP("streak_bonus", 20));

  return events;
}
