"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getDailyProgress } from "@/lib/firestore";
import { seedQuestions } from "@/lib/seed-questions";
import { DailyProgress } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";

export default function ReviewPage() {
  const [progress, setProgress] = useState<DailyProgress | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    setProgress(getDailyProgress());
  }, []);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!progress || progress.answers.length === 0) {
    return (
      <div className="px-6 py-8 max-w-md mx-auto text-center space-y-4">
        <p className="text-muted-foreground">No answers to review yet.</p>
        <Link href="/challenge">
          <Button className="bg-primary hover:bg-primary/90 text-black font-semibold">
            Start Challenge
          </Button>
        </Link>
      </div>
    );
  }

  const correct = progress.answers.filter((a) => a.correct).length;

  return (
    <div className="px-6 py-8 max-w-md mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard">
          <ArrowLeft className="text-muted-foreground hover:text-foreground" size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-foreground">Today&apos;s Review</h1>
          <p className="text-sm text-muted-foreground">
            {correct}/{progress.answers.length} correct ({Math.round((correct / progress.answers.length) * 100)}%)
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {progress.answers.map((answer, index) => {
          const question = seedQuestions.find((q) => q.id === answer.questionId);
          if (!question) return null;
          const isExpanded = expanded.has(answer.questionId);

          return (
            <div
              key={answer.questionId}
              className={cn(
                "border rounded-xl overflow-hidden transition-all",
                answer.correct ? "border-[#22C55E]/30 bg-[#22C55E]/5" : "border-[#EF4444]/30 bg-[#EF4444]/5"
              )}
            >
              <button
                onClick={() => toggleExpand(answer.questionId)}
                className="w-full text-left p-4 flex items-start gap-3"
              >
                <span className={cn(
                  "text-sm font-bold mt-0.5 shrink-0",
                  answer.correct ? "text-[#22C55E]" : "text-[#EF4444]"
                )}>
                  {answer.correct ? "✓" : "✗"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground font-medium">
                    Q{index + 1}. {question.text.substring(0, 80)}...
                  </p>
                </div>
                {isExpanded ? (
                  <ChevronUp className="text-muted-foreground shrink-0" size={16} />
                ) : (
                  <ChevronDown className="text-muted-foreground shrink-0" size={16} />
                )}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-border/50">
                  <p className="text-sm text-foreground mt-3">{question.text}</p>
                  <div className="space-y-1">
                    {question.options.map((opt, i) => (
                      <div
                        key={i}
                        className={cn(
                          "text-xs py-1 px-2 rounded",
                          i === question.correctAnswer && "text-[#22C55E] font-semibold",
                          i === answer.selectedAnswer && i !== question.correctAnswer && "text-[#EF4444] line-through"
                        )}
                      >
                        {opt}
                        {i === question.correctAnswer && " ✓"}
                        {i === answer.selectedAnswer && i !== question.correctAnswer && " (your answer)"}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{question.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Link href="/dashboard">
        <Button variant="outline" className="w-full border-border text-foreground">
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
