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
}

export interface DailyProgress {
  date: string;
  questionsAnswered: number;
  correct: number;
  timeSpent: number;
  answers: QuizAnswer[];
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
