"use client";

import { Question } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle } from "@phosphor-icons/react";

interface QuizCardProps {
  question: Question;
  selectedAnswer: number | null;
  onSelect: (index: number) => void;
  showResult: boolean;
}

const optionLabels = ["A", "B", "C", "D"];

export function QuizCard({ question, selectedAnswer, onSelect, showResult }: QuizCardProps) {
  return (
    <div className="space-y-6">
      <p className="text-lg font-heading font-semibold text-foreground leading-relaxed">
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
                "w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-start gap-3.5 group",
                variant === "default" && "glass-card hover:border-amber-500/30 hover:scale-[1.01]",
                variant === "selected" && "border-amber-500 bg-amber-500/10",
                variant === "correct" && "border-emerald-500 bg-emerald-500/10 animate-bounce-in",
                variant === "wrong" && "border-rose-500 bg-rose-500/10 animate-shake",
                showResult && "cursor-default"
              )}
            >
              <span className={cn(
                "shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-heading font-bold transition-all",
                variant === "default" && "bg-border/50 text-muted-foreground group-hover:bg-amber-500/10 group-hover:text-amber-500",
                variant === "selected" && "bg-amber-500 text-white",
                variant === "correct" && "bg-emerald-500 text-white",
                variant === "wrong" && "bg-rose-500 text-white",
              )}>
                {showResult && isCorrect ? (
                  <CheckCircle size={18} weight="bold" />
                ) : showResult && isSelected && !isCorrect ? (
                  <XCircle size={18} weight="bold" />
                ) : (
                  optionLabels[index]
                )}
              </span>
              <span className={cn(
                "text-sm font-medium pt-1",
                variant === "correct" && "text-emerald-500",
                variant === "wrong" && "text-rose-500",
                (variant === "default" || variant === "selected") && "text-foreground",
              )}>
                {option}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
