import { QuestionHistory, Question } from "./types";
import { seedQuestions } from "./seed-questions";
import { WORLDS, getWorldForDay } from "./gulf-schedule";

const HISTORY_KEY = "question-history";

function getHistory(): Record<string, QuestionHistory> {
  if (typeof window === "undefined") return {};
  const data = localStorage.getItem(HISTORY_KEY);
  return data ? JSON.parse(data) : {};
}

function saveHistory(history: Record<string, QuestionHistory>): void {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function recordQuestionResult(questionId: string, dayNumber: number, correct: boolean): void {
  const history = getHistory();
  const existing = history[questionId] || {
    questionId,
    dayNumber,
    attempts: 0,
    correct: 0,
    lastSeen: 0,
  };

  existing.attempts += 1;
  if (correct) existing.correct += 1;
  existing.lastSeen = Date.now();

  history[questionId] = existing;
  saveHistory(history);
}

export function getQuestionAccuracy(questionId: string): number {
  const history = getHistory();
  const entry = history[questionId];
  if (!entry || entry.attempts === 0) return 1; // unknown = assume good
  return entry.correct / entry.attempts;
}

export function getReviewQuestions(unlockedDay: number, count: number = 10): Question[] {
  if (unlockedDay <= 6) return []; // No review until after Foundation world

  const history = getHistory();
  const currentWorld = getWorldForDay(unlockedDay);

  // Get questions from COMPLETED prior worlds only
  const completedWorldIds = WORLDS
    .filter((w) => w.dayEnd < (currentWorld?.dayStart || unlockedDay))
    .map((w) => w.id);

  if (completedWorldIds.length === 0) return [];

  // Find all questions from prior worlds
  const priorWorldQuestions = seedQuestions.filter((q) => {
    if (!q.day) return false;
    const qWorld = getWorldForDay(q.day);
    return qWorld && completedWorldIds.includes(qWorld.id);
  });

  // Score each question: lower accuracy = higher priority, longer since seen = higher priority
  const scored = priorWorldQuestions.map((q) => {
    const h = history[q.id];
    const accuracy = h ? (h.attempts > 0 ? h.correct / h.attempts : 1) : 0.5;
    const lastSeen = h?.lastSeen || 0;
    const daysSinceSeen = (Date.now() - lastSeen) / (1000 * 60 * 60 * 24);
    // Lower accuracy = higher score, longer ago = higher score
    const score = (1 - accuracy) * 100 + Math.min(daysSinceSeen, 30);
    return { question: q, score };
  });

  // Sort by score descending (weakest first)
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, count).map((s) => s.question);
}

export function getWeakTopics(unlockedDay: number): { topic: string; accuracy: number }[] {
  const history = getHistory();
  const topicStats: Record<string, { correct: number; total: number }> = {};

  for (const [qId, h] of Object.entries(history)) {
    const q = seedQuestions.find((sq) => sq.id === qId);
    if (!q || !q.day || q.day > unlockedDay) continue;
    const topic = q.topic;
    if (!topicStats[topic]) topicStats[topic] = { correct: 0, total: 0 };
    topicStats[topic].correct += h.correct;
    topicStats[topic].total += h.attempts;
  }

  return Object.entries(topicStats)
    .map(([topic, stats]) => ({
      topic,
      accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
    }))
    .sort((a, b) => a.accuracy - b.accuracy);
}
