import { Question, UserProfile } from "./types";
import { seedQuestions } from "./seed-questions";

export function selectDailyQuestions(
  profile: UserProfile | null,
  count: number = 10
): Question[] {
  let pool = [...seedQuestions];

  // Filter by user's exam and specialty
  if (profile) {
    const filtered = pool.filter(
      (q) => q.exam === profile.exam && q.specialty === profile.specialty
    );
    // If not enough matching questions, broaden the filter
    if (filtered.length >= count) {
      pool = filtered;
    } else {
      const byExam = pool.filter((q) => q.exam === profile.exam);
      if (byExam.length >= count) {
        pool = byExam;
      }
    }

    // Phase selection based on current day
    const day = profile.currentDay || 1;
    let phase: 1 | 2 | 3;
    if (day <= 15) phase = 1;
    else if (day <= 30) phase = 2;
    else phase = 3;

    const phaseFiltered = pool.filter((q) => q.phase === phase);
    if (phaseFiltered.length >= count) {
      pool = phaseFiltered;
    }
  }

  // Shuffle using Fisher-Yates
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, count);
}
