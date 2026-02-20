"use client";

import Link from "next/link";
import { ProgressRing } from "./progress-ring";
import { Trophy, BookOpen, ArrowRight, Lightning, Crosshair, Fire, CheckCircle, XCircle, Timer, CurrencyCircleDollar } from "@phosphor-icons/react";
import { getUserProfile } from "@/lib/firestore";
import { formatCooldownTime } from "@/lib/cooldown";
import { HC_REWARDS } from "@/lib/hero-credits";

interface ScoreSummaryProps {
  correct: number;
  total: number;
  timeSpent: number;
  passed?: boolean;
  dayNumber?: number;
  cooldownMs?: number;
}

export function ScoreSummary({ correct, total, timeSpent, passed, dayNumber, cooldownMs }: ScoreSummaryProps) {
  const percentage = Math.round((correct / total) * 100);
  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;
  const profile = getUserProfile();

  const getMessage = () => {
    if (passed) {
      if (percentage >= 95) return "Outstanding!";
      if (percentage >= 90) return "Excellent!";
      return "Mastery Achieved!";
    }
    return "Keep Studying!";
  };

  // XP breakdown (only if passed)
  const correctXP = passed ? correct * 10 : 0;
  const completionXP = passed ? 50 : 0;
  const perfectXP = passed && correct === total ? 100 : 0;
  const streak = profile?.streak || 0;
  const streakXP = passed ? (streak >= 30 ? 200 : streak >= 14 ? 100 : streak >= 7 ? 50 : streak >= 3 ? 20 : 0) : 0;
  const totalXP = correctXP + completionXP + perfectXP + streakXP;

  return (
    <div className="flex flex-col items-center text-center space-y-6 p-6 animate-fade-up animate-fade-up-1">
      {/* Pass/Fail Badge */}
      <div className="space-y-2">
        {passed !== undefined && (
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-heading font-bold ${
            passed
              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
              : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
          }`}>
            {passed ? <CheckCircle size={18} weight="fill" /> : <XCircle size={18} weight="fill" />}
            {passed ? "PASSED" : "FAILED"} — {percentage}%
          </div>
        )}
        <h2 className="text-2xl font-heading font-bold text-foreground">
          {dayNumber ? `Day ${dayNumber} Complete` : "Challenge Complete"}
        </h2>
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

      {/* HC earned (if passed) */}
      {passed && (
        <div className="glass-card rounded-2xl p-4 w-full max-w-sm flex items-center justify-center gap-2">
          <CurrencyCircleDollar size={22} weight="fill" className="text-amber-500" />
          <span className="font-heading font-bold text-amber-500">+{HC_REWARDS.DAILY_PASS} Hero Credits earned!</span>
        </div>
      )}

      {/* Cooldown warning (if failed) */}
      {!passed && cooldownMs && cooldownMs > 0 && (
        <div className="glass-card rounded-2xl p-4 w-full max-w-sm space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Timer size={20} weight="duotone" className="text-rose-500" />
            <span className="font-heading font-semibold text-rose-500">Cooldown: {formatCooldownTime(cooldownMs)}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Go back and study the topics. You need 80% ({Math.ceil(total * 0.8)}/{total}) to pass.
          </p>
        </div>
      )}

      {/* XP Breakdown (only if passed) */}
      {passed && totalXP > 0 && (
        <div className="glass-card rounded-2xl p-5 w-full max-w-sm space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Lightning size={20} weight="fill" className="text-amber-500" />
            <span className="text-lg font-heading font-bold text-amber-500">+{totalXP} XP Earned</span>
          </div>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Correct answers ({correct}x10)</span>
              <span className="font-medium text-foreground">+{correctXP}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Daily completion</span>
              <span className="font-medium text-foreground">+{completionXP}</span>
            </div>
            {perfectXP > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-1">Perfect score <Crosshair size={14} weight="bold" className="text-amber-500" /></span>
                <span className="font-medium text-amber-500">+{perfectXP}</span>
              </div>
            )}
            {streakXP > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-1">Streak bonus <Fire size={14} weight="fill" className="text-amber-500" /></span>
                <span className="font-medium text-amber-500">+{streakXP}</span>
              </div>
            )}
          </div>
        </div>
      )}

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
