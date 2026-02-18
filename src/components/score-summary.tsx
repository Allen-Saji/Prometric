"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "./progress-ring";

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
    if (percentage >= 90) return "Outstanding! 🏆";
    if (percentage >= 70) return "Great work! 💪";
    if (percentage >= 50) return "Good effort! 📚";
    return "Keep practicing! 🎯";
  };

  return (
    <div className="flex flex-col items-center text-center space-y-6 p-6">
      <h2 className="text-2xl font-bold text-foreground">Challenge Complete!</h2>
      <p className="text-xl text-primary">{getMessage()}</p>

      <ProgressRing progress={percentage} size={160} strokeWidth={10} />

      <div className="grid grid-cols-3 gap-6 w-full max-w-sm">
        <div>
          <p className="text-2xl font-bold text-[#22C55E]">{correct}</p>
          <p className="text-xs text-muted-foreground">Correct</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-[#EF4444]">{total - correct}</p>
          <p className="text-xs text-muted-foreground">Wrong</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </p>
          <p className="text-xs text-muted-foreground">Time</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        <Link href="/challenge/review">
          <Button className="w-full bg-primary hover:bg-primary/90 text-black font-semibold">
            Review Answers
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="outline" className="w-full border-border text-foreground">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
