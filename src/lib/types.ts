export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  exam: "DHA" | "MOH" | "SLE" | "HAAD";
  specialty: "medicine" | "nursing" | "pharmacy" | "dentistry";
  topic: string;
  difficulty: 1 | 2 | 3;
  phase: 1 | 2 | 3;
  day?: number;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  exam: "DHA" | "MOH" | "SLE" | "HAAD";
  specialty: "medicine" | "nursing" | "pharmacy" | "dentistry";
  createdAt: string;
  paidAt?: string;
  streak: number;
  longestStreak: number;
  currentDay: number;
  xp: number;
  level: number;
  hearts: number;
  heartsLastRegen: number;
  battleHistory: BattleResult[];
  heroCredits: number;
  mockTestTokens: number;
  unlockedDay: number;
}

export interface DailyProgress {
  date: string;
  questionsAnswered: number;
  correct: number;
  timeSpent: number;
  answers: QuizAnswer[];
  dayNumber?: number;
  attempts?: number;
  passed?: boolean;
  lastAttemptAt?: number;
  score?: number;
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: number;
  correct: boolean;
  timeSpent: number;
}

export interface XPEvent {
  type: 'correct_answer' | 'daily_complete' | 'perfect_score' | 'streak_bonus' | 'battle_win' | 'battle_loss' | 'battle_draw';
  amount: number;
  timestamp: number;
}

export interface BattleResult {
  date: string;
  playerScore: number;
  opponentScore: number;
  xpEarned: number;
  won: boolean;
}

export type Exam = "DHA" | "MOH" | "SLE" | "HAAD";
export type Specialty = "medicine" | "nursing" | "pharmacy" | "dentistry";

// Gulf Schedule types
export interface GulfDay {
  day: number;
  topics: string[];
  subtopics: string[];
  worldId: string;
}

export interface World {
  id: string;
  name: string;
  color: string;
  icon: string;
  dayStart: number;
  dayEnd: number;
  description: string;
}

// Question history for spaced repetition
export interface QuestionHistory {
  questionId: string;
  dayNumber: number;
  attempts: number;
  correct: number;
  lastSeen: number;
}

// Mock test types
export interface MockTestResult {
  id: string;
  type: "milestone" | "final";
  milestone?: number;
  score: number;
  total: number;
  timeSpent: number;
  completedAt: number;
  perWorldBreakdown: Record<string, { correct: number; total: number }>;
}

// Cooldown state
export interface CooldownState {
  dayNumber: number;
  attempts: number;
  lockedUntil: number;
}

// Lounge types
export interface LoungeMessage {
  id: string;
  userName: string;
  text: string;
  timestamp: number;
}
