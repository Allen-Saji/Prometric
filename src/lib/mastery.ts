const MASTERY_THRESHOLD = 0.8; // 80%
const DAY_RESULTS_KEY = "day-results";

export interface DayResult {
  dayNumber: number;
  score: number;
  total: number;
  passed: boolean;
  attempts: number;
  lastAttemptAt: number;
}

function getAllDayResults(): Record<number, DayResult> {
  if (typeof window === "undefined") return {};
  const data = localStorage.getItem(DAY_RESULTS_KEY);
  return data ? JSON.parse(data) : {};
}

function saveDayResults(results: Record<number, DayResult>): void {
  localStorage.setItem(DAY_RESULTS_KEY, JSON.stringify(results));
}

export function checkMasteryPass(correct: number, total: number): boolean {
  if (total === 0) return false;
  return correct / total >= MASTERY_THRESHOLD;
}

export function getDayResult(dayNumber: number): DayResult | null {
  const results = getAllDayResults();
  return results[dayNumber] || null;
}

export function getDayAttempts(dayNumber: number): number {
  const result = getDayResult(dayNumber);
  return result?.attempts || 0;
}

export function saveDayResult(dayNumber: number, score: number, total: number): DayResult {
  const results = getAllDayResults();
  const existing = results[dayNumber];
  const passed = checkMasteryPass(score, total);
  const attempts = (existing?.attempts || 0) + 1;

  const result: DayResult = {
    dayNumber,
    score,
    total,
    passed,
    attempts,
    lastAttemptAt: Date.now(),
  };

  results[dayNumber] = result;
  saveDayResults(results);
  return result;
}

export function isDayPassed(dayNumber: number): boolean {
  const result = getDayResult(dayNumber);
  return result?.passed || false;
}

export function getHighestPassedDay(): number {
  const results = getAllDayResults();
  let highest = 0;
  for (const [day, result] of Object.entries(results)) {
    if (result.passed && Number(day) > highest) {
      highest = Number(day);
    }
  }
  return highest;
}
