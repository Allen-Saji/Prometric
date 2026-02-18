"use client";

import { useState, useEffect, useCallback } from "react";
import { Question } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Timer } from "@phosphor-icons/react";

interface BattleQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (correct: boolean) => void;
}

export function BattleQuestion({ question, questionNumber, totalQuestions, onAnswer }: BattleQuestionProps) {
  const [timeLeft, setTimeLeft] = useState(15);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    setTimeLeft(15);
    setSelected(null);
    setAnswered(false);
  }, [question.id]);

  useEffect(() => {
    if (answered) return;
    if (timeLeft <= 0) {
      setAnswered(true);
      setTimeout(() => onAnswer(false), 800);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 0.1), 100);
    return () => clearTimeout(timer);
  }, [timeLeft, answered, onAnswer]);

  const handleSelect = useCallback((index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    const correct = index === question.correctAnswer;
    setTimeout(() => onAnswer(correct), 800);
  }, [answered, question.correctAnswer, onAnswer]);

  const timerPercent = (timeLeft / 15) * 100;
  const timerColor = timeLeft > 10 ? "bg-emerald-500" : timeLeft > 5 ? "bg-amber-500" : "bg-rose-500";

  return (
    <div className="space-y-6 animate-fade-up animate-fade-up-1">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          Question {questionNumber}/{totalQuestions}
        </span>
        <div className="flex items-center gap-1.5">
          <Timer size={16} weight="bold" className={timeLeft <= 5 ? "text-rose-500" : "text-muted-foreground"} />
          <span className={cn("text-sm font-bold font-heading", timeLeft <= 5 ? "text-rose-500" : "text-foreground")}>
            {Math.ceil(timeLeft)}s
          </span>
        </div>
      </div>

      {/* Timer bar */}
      <div className="w-full h-2 rounded-full bg-border/50 overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-100 ease-linear", timerColor)}
          style={{ width: `${timerPercent}%` }}
        />
      </div>

      {/* Question */}
      <div className="glass-card rounded-2xl p-5">
        <p className="text-base font-medium text-foreground leading-relaxed">{question.text}</p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          let optionClass = "glass-card";
          if (answered && index === question.correctAnswer) {
            optionClass = "bg-emerald-500/20 border-emerald-500/50 border";
          } else if (answered && index === selected && index !== question.correctAnswer) {
            optionClass = "bg-rose-500/20 border-rose-500/50 border";
          }

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={answered}
              className={cn(
                "w-full text-left p-4 rounded-xl transition-all duration-200",
                optionClass,
                !answered && "hover:scale-[1.01] active:scale-[0.99]"
              )}
            >
              <span className="text-sm font-medium text-foreground">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
