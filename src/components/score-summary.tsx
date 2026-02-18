"use client";

import Link from "next/link";
import { ProgressRing } from "./progress-ring";
import { Trophy, BookOpen, ArrowRight } from "@phosphor-icons/react";

interface ScoreSummaryProps {
  correct: number;
  total: number;
  timeSpent: number;
}

export function ScoreSummary({ correct, total, timeSpent }: ScoreSummaryProps) {
  const percentage = Math.round((correct / total) * 100);
  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;

  const getMessage = () => {
    if (percentage >= 90) return "Outstanding!";
    if (percentage >= 70) return "Great work!";
    if (percentage >= 50) return "Good effort!";
    return "Keep practicing!";
  };

  return (
    <div className="flex flex-col items-center text-center space-y-8 p-6 animate-fade-up animate-fade-up-1">
      <div className="space-y-2">
        <h2 className="text-2xl font-heading font-bold text-foreground">Challenge Complete</h2>
        <div className="flex items-center justify-center gap-2">
          <Trophy size={22} weight="duotone" className="text-amber-500" />
          <p className="text-lg font-heading font-semibold text-amber-500">{getMessage()}</p>
        </div>
      </div>

      <ProgressRing progress={percentage} size={160} strokeWidth={10} />

      <div className="grid grid-cols-3 gap-6 w-full max-w-sm">
        <div className="glass-card rounded-2xl p-4">
          <p className="text-2xl font-heading font-bold text-emerald-500">{correct}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Correct</p>
        </div>
        <div className="glass-card rounded-2xl p-4">
          <p className="text-2xl font-heading font-bold text-rose-500">{total - correct}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Wrong</p>
        </div>
        <div className="glass-card rounded-2xl p-4">
          <p className="text-2xl font-heading font-bold text-foreground">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">Time</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        <Link href="/challenge/review">
          <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 text-white font-heading font-semibold py-4 rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-200">
            <BookOpen size={20} weight="bold" />
            Review Answers
          </button>
        </Link>
        <Link href="/dashboard">
          <button className="w-full glass-card text-foreground font-medium py-4 rounded-xl hover:scale-[1.01] transition-all duration-200">
            Back to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}
