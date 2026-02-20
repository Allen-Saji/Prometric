"use client";

import { useState, useEffect, useCallback } from "react";
import { getUserProfile } from "@/lib/firestore";
import { getHC, spendHC, HC_COSTS, getMockTestTokens, useMockTestToken } from "@/lib/hero-credits";
import { getQuestionsForDays } from "@/lib/questions";
import { MockTest } from "@/components/mock-test";
import { MockTestResultView } from "@/components/mock-test-result";
import { UserProfile, MockTestResult, Question } from "@/lib/types";
import { Lock, CurrencyCircleDollar, Ticket, Exam, Trophy } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface MockTestDef {
  id: string;
  label: string;
  type: "milestone" | "final";
  milestone?: number;
  requiredDay: number;
  dayStart: number;
  dayEnd: number;
  questionCount: number;
  cost: number;
  timerMinutes: number;
}

const MOCK_TESTS: MockTestDef[] = [
  { id: "mock-10", label: "Milestone 1", type: "milestone", milestone: 10, requiredDay: 1, dayStart: 1, dayEnd: 10, questionCount: 50, cost: HC_COSTS.MILESTONE_MOCK, timerMinutes: 60 },
  { id: "mock-20", label: "Milestone 2", type: "milestone", milestone: 20, requiredDay: 20, dayStart: 1, dayEnd: 20, questionCount: 50, cost: HC_COSTS.MILESTONE_MOCK, timerMinutes: 60 },
  { id: "mock-30", label: "Milestone 3", type: "milestone", milestone: 30, requiredDay: 30, dayStart: 1, dayEnd: 30, questionCount: 50, cost: HC_COSTS.MILESTONE_MOCK, timerMinutes: 60 },
  { id: "mock-40", label: "Milestone 4", type: "milestone", milestone: 40, requiredDay: 40, dayStart: 1, dayEnd: 40, questionCount: 50, cost: HC_COSTS.MILESTONE_MOCK, timerMinutes: 60 },
  { id: "final-boss", label: "Final Boss", type: "final", requiredDay: 44, dayStart: 1, dayEnd: 44, questionCount: 120, cost: HC_COSTS.FINAL_BOSS, timerMinutes: 120 },
];

const RESULTS_KEY = "mock-test-results";

function getSavedResults(): MockTestResult[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(RESULTS_KEY);
  return data ? JSON.parse(data) : [];
}

export default function MockTestsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeMock, setActiveMock] = useState<MockTestDef | null>(null);
  const [mockQuestions, setMockQuestions] = useState<Question[]>([]);
  const [result, setResult] = useState<MockTestResult | null>(null);
  const [hc, setHC] = useState(0);
  const [tokens, setTokens] = useState(0);

  useEffect(() => {
    setProfile(getUserProfile());
    setHC(getHC());
    setTokens(getMockTestTokens());
  }, []);

  const unlockedDay = profile?.unlockedDay || profile?.currentDay || 1;

  const startMock = (mock: MockTestDef) => {
    // Check if user can afford
    if (tokens > 0) {
      useMockTestToken();
      setTokens((t) => t - 1);
    } else if (hc >= mock.cost) {
      spendHC(mock.cost, `Mock test: ${mock.label}`);
      setHC((h) => h - mock.cost);
    } else {
      return; // Can't afford
    }

    const qs = getQuestionsForDays(mock.dayStart, mock.dayEnd);
    // Shuffle and pick
    const shuffled = [...qs].sort(() => Math.random() - 0.5);
    setMockQuestions(shuffled.slice(0, mock.questionCount));
    setActiveMock(mock);
  };

  const handleMockComplete = useCallback((score: number, total: number, timeSpent: number, perWorld: Record<string, { correct: number; total: number }>) => {
    if (!activeMock) return;
    const newResult: MockTestResult = {
      id: `${activeMock.id}-${Date.now()}`,
      type: activeMock.type,
      milestone: activeMock.milestone,
      score,
      total,
      timeSpent,
      completedAt: Date.now(),
      perWorldBreakdown: perWorld,
    };

    const results = getSavedResults();
    results.push(newResult);
    localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
    setResult(newResult);
    setActiveMock(null);
  }, [activeMock]);

  if (result) {
    return (
      <div className="px-6 py-8 max-w-md mx-auto">
        <MockTestResultView result={result} onBack={() => setResult(null)} />
      </div>
    );
  }

  if (activeMock && mockQuestions.length > 0) {
    return (
      <div className="px-6 py-8 max-w-md mx-auto">
        <MockTest
          questions={mockQuestions}
          timerMinutes={activeMock.timerMinutes}
          onComplete={handleMockComplete}
        />
      </div>
    );
  }

  return (
    <div className="px-6 py-8 max-w-md mx-auto space-y-6">
      <div className="animate-fade-up animate-fade-up-1">
        <h1 className="text-2xl font-heading font-bold text-foreground">Mock Tests</h1>
        <p className="text-sm text-muted-foreground mt-1">Simulate the real exam experience</p>
      </div>

      {/* Balance */}
      <div className="glass-card rounded-2xl p-4 flex items-center justify-around animate-fade-up animate-fade-up-1">
        <div className="flex items-center gap-2">
          <CurrencyCircleDollar size={20} weight="fill" className="text-amber-500" />
          <span className="font-heading font-bold text-foreground">{hc} HC</span>
        </div>
        <div className="w-px h-8 bg-border" />
        <div className="flex items-center gap-2">
          <Ticket size={20} weight="duotone" className="text-emerald-500" />
          <span className="font-heading font-bold text-foreground">{tokens} Free Tokens</span>
        </div>
      </div>

      {/* Mock test cards */}
      <div className="space-y-3 animate-fade-up animate-fade-up-2">
        {MOCK_TESTS.map((mock) => {
          const isLocked = unlockedDay < mock.requiredDay;
          const canAfford = tokens > 0 || hc >= mock.cost;
          const isFinal = mock.type === "final";

          return (
            <div
              key={mock.id}
              className={cn(
                "glass-card rounded-2xl p-5 space-y-3 transition-all",
                isFinal && "ring-1 ring-amber-500/30",
                isLocked && "opacity-50"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    isFinal ? "bg-amber-500/20" : "bg-sky-500/10"
                  )}>
                    {isLocked ? (
                      <Lock size={20} weight="duotone" className="text-muted-foreground" />
                    ) : isFinal ? (
                      <Trophy size={20} weight="fill" className="text-amber-500" />
                    ) : (
                      <Exam size={20} weight="duotone" className="text-sky-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-foreground text-sm">{mock.label}</h3>
                    <p className="text-[11px] text-muted-foreground">
                      {mock.questionCount} Qs · {mock.timerMinutes} min · Days {mock.dayStart}-{mock.dayEnd}
                    </p>
                  </div>
                </div>

                {!isLocked && (
                  <div className="flex items-center gap-1 text-xs font-medium">
                    {tokens > 0 ? (
                      <span className="text-emerald-500">FREE</span>
                    ) : (
                      <span className="text-amber-500">{mock.cost} HC</span>
                    )}
                  </div>
                )}
              </div>

              {isLocked ? (
                <p className="text-xs text-muted-foreground">
                  Unlocks at Day {mock.requiredDay}
                </p>
              ) : (
                <button
                  onClick={() => startMock(mock)}
                  disabled={!canAfford}
                  className={cn(
                    "w-full py-3 rounded-xl font-heading font-semibold text-sm transition-all",
                    canAfford
                      ? "bg-gradient-to-r from-amber-500 to-amber-400 text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/20"
                      : "bg-border text-muted-foreground cursor-not-allowed"
                  )}
                >
                  {canAfford ? "Start Mock Test" : "Not Enough HC"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
