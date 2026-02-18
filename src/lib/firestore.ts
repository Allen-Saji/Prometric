import { UserProfile, DailyProgress, QuizAnswer } from "./types";
import { seedQuestions } from "./seed-questions";

const PROFILE_KEY = "user-profile";
const PROGRESS_KEY = "daily-progress";

function getTodayKey(): string {
  return new Date().toISOString().split("T")[0];
}

export function getUserProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(PROFILE_KEY);
  return data ? JSON.parse(data) : null;
}

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getDailyProgress(date?: string): DailyProgress | null {
  if (typeof window === "undefined") return null;
  const key = date || getTodayKey();
  const allProgress = getAllProgress();
  return allProgress[key] || null;
}

export function getAllProgress(): Record<string, DailyProgress> {
  if (typeof window === "undefined") return {};
  const data = localStorage.getItem(PROGRESS_KEY);
  return data ? JSON.parse(data) : {};
}

export function saveDailyProgress(progress: DailyProgress): void {
  const allProgress = getAllProgress();
  allProgress[progress.date] = progress;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
}

export function updateStreak(): number {
  const profile = getUserProfile();
  if (!profile) return 0;

  const today = getTodayKey();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const allProgress = getAllProgress();

  const todayProgress = allProgress[today];
  if (!todayProgress || todayProgress.questionsAnswered < 10) {
    return profile.streak;
  }

  const yesterdayProgress = allProgress[yesterday];
  let newStreak: number;

  if (yesterdayProgress && yesterdayProgress.questionsAnswered >= 10) {
    newStreak = profile.streak + 1;
  } else if (profile.streak === 0) {
    newStreak = 1;
  } else {
    newStreak = 1; // streak broken
  }

  profile.streak = newStreak;
  profile.longestStreak = Math.max(profile.longestStreak, newStreak);
  profile.currentDay = Math.min(profile.currentDay + 1, 45);
  saveUserProfile(profile);
  return newStreak;
}

export function getQuestions(count: number = 10) {
  const profile = getUserProfile();
  let questions = [...seedQuestions];

  if (profile) {
    questions = questions.filter(
      (q) => q.exam === profile.exam || q.specialty === profile.specialty
    );
  }

  if (questions.length < count) {
    questions = [...seedQuestions];
  }

  // Shuffle and pick
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }

  return questions.slice(0, count);
}

export function saveQuizAnswer(answer: QuizAnswer): void {
  const today = getTodayKey();
  let progress = getDailyProgress(today);

  if (!progress) {
    progress = {
      date: today,
      questionsAnswered: 0,
      correct: 0,
      timeSpent: 0,
      answers: [],
    };
  }

  progress.answers.push(answer);
  progress.questionsAnswered = progress.answers.length;
  progress.correct = progress.answers.filter((a) => a.correct).length;
  progress.timeSpent += answer.timeSpent;

  saveDailyProgress(progress);
}

export function getTotalStats() {
  const allProgress = getAllProgress();
  const days = Object.values(allProgress);
  const totalAnswered = days.reduce((sum, d) => sum + d.questionsAnswered, 0);
  const totalCorrect = days.reduce((sum, d) => sum + d.correct, 0);
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  return { totalAnswered, totalCorrect, accuracy, daysCompleted: days.length };
}
