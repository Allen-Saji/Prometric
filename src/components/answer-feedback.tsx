"use client";

import { cn } from "@/lib/utils";
import { BookOpen, CheckCircle, XCircle } from "@phosphor-icons/react";

interface AnswerFeedbackProps {
  correct: boolean;
  explanation: string;
  visible: boolean;
}

export function AnswerFeedback({ correct, explanation, visible }: AnswerFeedbackProps) {
  if (!visible) return null;

  return (
    <div
      className={cn(
        "mt-4 p-5 rounded-2xl border transition-all duration-300 animate-in slide-in-from-bottom-4",
        correct
          ? "border-emerald-500/20 bg-emerald-500/5"
          : "border-rose-500/20 bg-rose-500/5"
      )}
    >
      <div className="flex items-center gap-2.5 mb-3">
        {correct ? (
          <CheckCircle size={22} weight="duotone" className="text-emerald-500" />
        ) : (
          <XCircle size={22} weight="duotone" className="text-rose-500" />
        )}
        <span className={cn("font-heading font-bold text-sm", correct ? "text-emerald-500" : "text-rose-500")}>
          {correct ? "Correct!" : "Incorrect"}
        </span>
      </div>
      <div className="flex items-start gap-2.5">
        <BookOpen size={16} weight="duotone" className="text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground leading-relaxed">{explanation}</p>
      </div>
    </div>
  );
}
