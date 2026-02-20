"use client";

import { useState, useEffect, useCallback } from "react";
import { Question, QuizAnswer } from "@/lib/types";
import { getWorldForDay } from "@/lib/gulf-schedule";
import { QuizCard } from "./quiz-card";
import { AnswerFeedback } from "./answer-feedback";
import { ArrowRight, Timer } from "@phosphor-icons/react";

interface MockTestProps {
  questions: Question[];
  timerMinutes: number;
  onComplete: (score: number, total: number, timeSpent: number, perWorld: Record<string, { correct: number; total: number }>) => void;
}

export function MockTest({ questions, timerMinutes, onComplete }: MockTestProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [totalTime, setTotalTime] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(timerMinutes * 60);
  const [startedAt] = useState(Date.now());

  // Global timer
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const remaining = timerMinutes * 60 - elapsed;
      if (remaining <= 0) {
        // Time's up — auto-complete
        clearInterval(interval);
        finishTest();
        return;
      }
      setTimeRemaining(remaining);
    }, 1000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startedAt, timerMinutes]);

  const finishTest = useCallback(() => {
    const correct = answers.filter((a) => a.correct).length;
    const elapsed = Math.round((Date.now() - startedAt) / 1000);

    // Per-world breakdown
    const perWorld: Record<string, { correct: number; total: number }> = {};
    questions.forEach((q, i) => {
      const world = q.day ? getWorldForDay(q.day) : null;
      const wid = world?.id || "unknown";
      if (!perWorld[wid]) perWorld[wid] = { correct: 0, total: 0 };
      perWorld[wid].total += 1;
      if (answers[i]?.correct) perWorld[wid].correct += 1;
    });

    onComplete(correct, questions.length, elapsed, perWorld);
  }, [answers, questions, startedAt, onComplete]);

  const handleSelect = useCallback(
    (index: number) => {
      if (showResult) return;
      setSelectedAnswer(index);
      setShowResult(true);

      const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
      const correct = index === questions[currentIndex].correctAnswer;

      setAnswers((prev) => [...prev, {
        questionId: questions[currentIndex].id,
        selectedAnswer: index,
        correct,
        timeSpent,
      }]);
      setTotalTime((prev) => prev + timeSpent);
    },
    [showResult, questions, currentIndex, questionStartTime]
  );

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      finishTest();
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuestionStartTime(Date.now());
  };

  const timerMins = Math.floor(timeRemaining / 60);
  const timerSecs = timeRemaining % 60;
  const isLowTime = timeRemaining < 300; // < 5 min

  const question = questions[currentIndex];
  if (!question) return null;
  const progressPercent = ((currentIndex + (showResult ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="space-y-6">
      {/* Timer + Progress */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          {currentIndex + 1} / {questions.length}
        </span>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
          isLowTime ? "bg-rose-500/10 text-rose-500" : "bg-foreground/5 text-foreground"
        }`}>
          <Timer size={16} weight="bold" />
          <span className="font-heading font-bold text-sm">
            {timerMins}:{timerSecs.toString().padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="w-full h-2 rounded-full bg-border/50 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sky-500 to-sky-400 transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <QuizCard
        question={question}
        selectedAnswer={selectedAnswer}
        onSelect={handleSelect}
        showResult={showResult}
      />

      <AnswerFeedback
        correct={selectedAnswer === question.correctAnswer}
        explanation={question.explanation}
        visible={showResult}
      />

      {showResult && (
        <button
          onClick={handleNext}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-sky-400 text-white font-heading font-semibold py-4 text-lg rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/20 transition-all duration-200"
        >
          {currentIndex + 1 >= questions.length ? "Finish" : "Next"}
          <ArrowRight size={20} weight="bold" />
        </button>
      )}
    </div>
  );
}
