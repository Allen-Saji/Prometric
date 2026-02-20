import { Question, UserProfile } from "./types";
import { seedQuestions } from "./seed-questions";
import { getReviewQuestions } from "./ghost-rule";
import { getWorldForDay } from "./gulf-schedule";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function selectDailyQuestions(
  profile: UserProfile | null,
  count: number = 50,
  dayNumber?: number
): Question[] {
  const day = dayNumber || profile?.currentDay || 1;

  // Ghost rule: first 10 are review from prior worlds (if day > 6)
  const reviewQs = getReviewQuestions(day, 10);

  // Day-specific questions
  let dayQs = seedQuestions.filter((q) => q.day === day);

  // If insufficient, pad with same-world questions
  if (dayQs.length < count - reviewQs.length) {
    const world = getWorldForDay(day);
    if (world) {
      const worldQs = seedQuestions.filter((q) => {
        if (!q.day) return false;
        const qWorld = getWorldForDay(q.day);
        return qWorld?.id === world.id && q.day !== day;
      });
      dayQs = [...dayQs, ...shuffle(worldQs)];
    }
  }

  // Remove duplicates with review questions
  const reviewIds = new Set(reviewQs.map((q) => q.id));
  dayQs = dayQs.filter((q) => !reviewIds.has(q.id));

  // Combine: review first, then day questions
  const combined = [...shuffle(reviewQs), ...shuffle(dayQs)];

  return combined.slice(0, count);
}

export function getQuestionsForDays(dayStart: number, dayEnd: number): Question[] {
  return seedQuestions.filter((q) => q.day !== undefined && q.day >= dayStart && q.day <= dayEnd);
}

export function getQuestionsForWorld(worldId: string): Question[] {
  return seedQuestions.filter((q) => {
    if (!q.day) return false;
    const world = getWorldForDay(q.day);
    return world?.id === worldId;
  });
}
