"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDailyProgress } from "@/lib/firestore";
import { seedQuestions } from "@/lib/seed-questions";
import { DailyProgress } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CaretDown, CaretUp, ArrowLeft, BookOpen, CheckCircle, XCircle } from "@phosphor-icons/react";

const optionLabels = ["A", "B", "C", "D"];

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
          <button className="bg-gradient-to-r from-amber-500 to-amber-400 text-white font-heading font-semibold px-6 py-3 rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-200">
            Start Challenge
          </button>
        </Link>
      </div>
    );
  }

  const correct = progress.answers.filter((a) => a.correct).length;

  return (
    <div className="px-6 py-8 max-w-md mx-auto space-y-6">
      <div className="flex items-center gap-3 animate-fade-up animate-fade-up-1">
        <Link href="/dashboard" className="p-2 -ml-2 rounded-lg hover:bg-accent transition-colors">
          <ArrowLeft size={20} weight="bold" className="text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground">Today&apos;s Review</h1>
          <p className="text-sm text-muted-foreground">
            <span className="text-emerald-500 font-medium">{correct}</span>/{progress.answers.length} correct ({Math.round((correct / progress.answers.length) * 100)}%)
          </p>
        </div>
      </div>

      <div className="space-y-3 animate-fade-up animate-fade-up-2">
        {progress.answers.map((answer, index) => {
          const question = seedQuestions.find((q) => q.id === answer.questionId);
          if (!question) return null;
          const isExpanded = expanded.has(answer.questionId);

          return (
            <div
              key={`${answer.questionId}-${index}`}
              className={cn(
                "glass-card rounded-2xl overflow-hidden transition-all",
                answer.correct ? "!border-emerald-500/20" : "!border-rose-500/20"
              )}
            >
              <button
                onClick={() => toggleExpand(answer.questionId)}
                className="w-full text-left p-4 flex items-start gap-3"
              >
                <div className={cn(
                  "shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5",
                  answer.correct ? "bg-emerald-500/10" : "bg-rose-500/10"
                )}>
                  {answer.correct ? (
                    <CheckCircle size={16} weight="bold" className="text-emerald-500" />
                  ) : (
                    <XCircle size={16} weight="bold" className="text-rose-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground font-medium leading-relaxed">
                    Q{index + 1}. {question.text.substring(0, 80)}...
                  </p>
                </div>
                {isExpanded ? (
                  <CaretUp size={16} weight="bold" className="text-muted-foreground shrink-0 mt-1" />
                ) : (
                  <CaretDown size={16} weight="bold" className="text-muted-foreground shrink-0 mt-1" />
                )}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-border/30">
                  <p className="text-sm text-foreground mt-3 leading-relaxed">{question.text}</p>
                  <div className="space-y-1.5">
                    {question.options.map((opt, i) => (
                      <div
                        key={i}
                        className={cn(
                          "text-xs py-2 px-3 rounded-lg flex items-center gap-2",
                          i === question.correctAnswer && "bg-emerald-500/10 text-emerald-500 font-semibold",
                          i === answer.selectedAnswer && i !== question.correctAnswer && "bg-rose-500/10 text-rose-500 line-through"
                        )}
                      >
                        <span className="font-heading font-bold text-[11px] w-5">{optionLabels[i]}.</span>
                        {opt}
                        {i === question.correctAnswer && <CheckCircle size={14} weight="bold" className="ml-auto shrink-0" />}
                        {i === answer.selectedAnswer && i !== question.correctAnswer && <span className="ml-auto text-[10px]">your answer</span>}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-start gap-2 pt-1">
                    <BookOpen size={14} weight="duotone" className="text-muted-foreground shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">{question.explanation}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Link href="/dashboard">
        <button className="w-full glass-card text-foreground font-medium py-4 rounded-xl hover:scale-[1.01] transition-all duration-200">
          Back to Dashboard
        </button>
      </Link>
    </div>
  );
}
