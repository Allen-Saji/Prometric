"use client";

import { Question } from "@/lib/types";
import { cn } from "@/lib/utils";

interface QuizCardProps {
  question: Question;
  selectedAnswer: number | null;
  onSelect: (index: number) => void;
  showResult: boolean;
}

export function QuizCard({ question, selectedAnswer, onSelect, showResult }: QuizCardProps) {
  return (
    <div className="space-y-6">
      <p className="text-lg font-medium text-[#FAFAFA] leading-relaxed">
        {question.text}
      </p>
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === question.correctAnswer;
          let variant = "default";
          if (showResult && isCorrect) variant = "correct";
          else if (showResult && isSelected && !isCorrect) variant = "wrong";
          else if (isSelected) variant = "selected";

          return (
            <button
              key={index}
              onClick={() => !showResult && onSelect(index)}
              disabled={showResult}
              className={cn(
                "w-full text-left p-4 rounded-xl border transition-all duration-200",
                "text-[#FAFAFA] font-medium",
                variant === "default" && "border-[#1F1F23] bg-[#141416] hover:border-[#F5A524]/50 hover:bg-[#141416]/80",
                variant === "selected" && "border-[#F5A524] bg-[#F5A524]/10",
                variant === "correct" && "border-[#22C55E] bg-[#22C55E]/10 text-[#22C55E]",
                variant === "wrong" && "border-[#EF4444] bg-[#EF4444]/10 text-[#EF4444]",
                showResult && "cursor-default"
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
