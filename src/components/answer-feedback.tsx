"use client";

import { cn } from "@/lib/utils";

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
        "mt-4 p-4 rounded-xl border transition-all duration-300 animate-in slide-in-from-bottom-4",
        correct
          ? "border-[#22C55E]/30 bg-[#22C55E]/5"
          : "border-[#EF4444]/30 bg-[#EF4444]/5"
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{correct ? "✅" : "❌"}</span>
        <span className={cn("font-semibold", correct ? "text-[#22C55E]" : "text-[#EF4444]")}>
          {correct ? "Correct!" : "Incorrect"}
        </span>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{explanation}</p>
    </div>
  );
}
