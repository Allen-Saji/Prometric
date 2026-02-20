"use client";

import { MockTestResult } from "@/lib/types";
import { WORLDS } from "@/lib/gulf-schedule";
import { ProgressRing } from "./progress-ring";
import { Trophy, Timer, ArrowLeft, ChartBar } from "@phosphor-icons/react";
import Link from "next/link";

interface MockTestResultViewProps {
  result: MockTestResult;
  onBack: () => void;
}

export function MockTestResultView({ result, onBack }: MockTestResultViewProps) {
  const percentage = Math.round((result.score / result.total) * 100);
  const minutes = Math.floor(result.timeSpent / 60);
  const seconds = result.timeSpent % 60;
  const passed = percentage >= 80;

  return (
    <div className="flex flex-col items-center text-center space-y-6 animate-fade-up animate-fade-up-1">
      <div className="space-y-2">
        <h2 className="text-2xl font-heading font-bold text-foreground">
          {result.type === "final" ? "Final Boss" : `Milestone ${result.milestone}`} Complete
        </h2>
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-heading font-bold ${
          passed
            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
            : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
        }`}>
          <Trophy size={18} weight="fill" />
          {percentage}% — {passed ? "PASSED" : "Needs Work"}
        </div>
      </div>

      <ProgressRing progress={percentage} size={160} strokeWidth={10} />

      <div className="grid grid-cols-3 gap-6 w-full max-w-sm">
        <div className="glass-card rounded-2xl p-4">
          <p className="text-2xl font-heading font-bold text-emerald-500">{result.score}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Correct</p>
        </div>
        <div className="glass-card rounded-2xl p-4">
          <p className="text-2xl font-heading font-bold text-rose-500">{result.total - result.score}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Wrong</p>
        </div>
        <div className="glass-card rounded-2xl p-4">
          <p className="text-2xl font-heading font-bold text-foreground">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">Time</p>
        </div>
      </div>

      {/* Per-world breakdown */}
      <div className="glass-card rounded-2xl p-5 w-full max-w-sm space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <ChartBar size={20} weight="duotone" className="text-amber-500" />
          <span className="font-heading font-bold text-foreground">Per-World Breakdown</span>
        </div>
        <div className="space-y-2">
          {WORLDS.map((world) => {
            const data = result.perWorldBreakdown[world.id];
            if (!data || data.total === 0) return null;
            const pct = Math.round((data.correct / data.total) * 100);
            return (
              <div key={world.id} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-20 text-left truncate">{world.name}</span>
                <div className="flex-1 h-2 rounded-full bg-border/50 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: world.color }}
                  />
                </div>
                <span className="text-xs font-medium text-foreground w-12 text-right">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        <button
          onClick={onBack}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 text-white font-heading font-semibold py-4 rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-200"
        >
          <ArrowLeft size={20} weight="bold" />
          Back to Mock Tests
        </button>
        <Link href="/dashboard">
          <button className="w-full glass-card text-foreground font-medium py-4 rounded-xl hover:scale-[1.01] transition-all duration-200">
            Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}
