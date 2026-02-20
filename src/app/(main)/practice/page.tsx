"use client";

import { useState, useEffect, useCallback } from "react";
import { getUserProfile } from "@/lib/firestore";
import { WORLDS, getDaysForWorld, getWorldForDay } from "@/lib/gulf-schedule";
import { seedQuestions } from "@/lib/seed-questions";
import { Question, QuizAnswer } from "@/lib/types";
import { QuizCard } from "@/components/quiz-card";
import { AnswerFeedback } from "@/components/answer-feedback";
import { ArrowRight, ArrowLeft, Shuffle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export default function PracticePage() {
  const [unlockedDay, setUnlockedDay] = useState(1);
  const [selectedWorld, setSelectedWorld] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [practicing, setPracticing] = useState(false);

  useEffect(() => {
    const profile = getUserProfile();
    setUnlockedDay(profile?.unlockedDay || profile?.currentDay || 1);
  }, []);

  const startPractice = (worldId: string) => {
    const world = WORLDS.find((w) => w.id === worldId);
    if (!world) return;

    const worldQs = seedQuestions.filter((q) => {
      if (!q.day) return false;
      const w = getWorldForDay(q.day);
      return w?.id === worldId && q.day <= unlockedDay;
    });

    if (worldQs.length === 0) return;

    // Shuffle
    const shuffled = [...worldQs].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setSelectedWorld(worldId);
    setPracticing(true);
  };

  const handleSelect = useCallback((index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
  }, [showResult]);

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      // Reshuffle and restart
      const shuffled = [...questions].sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
      setCurrentIndex(0);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
    setSelectedAnswer(null);
    setShowResult(false);
  };

  if (practicing && questions.length > 0) {
    const question = questions[currentIndex];
    return (
      <div className="px-6 py-8 max-w-md mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPracticing(false)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} weight="bold" />
            Back
          </button>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} / {questions.length}
          </span>
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
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 text-white font-heading font-semibold py-4 text-lg rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-200"
          >
            Next Question
            <ArrowRight size={20} weight="bold" />
          </button>
        )}
      </div>
    );
  }

  // Topic picker
  return (
    <div className="px-6 py-8 max-w-md mx-auto space-y-6">
      <div className="animate-fade-up animate-fade-up-1">
        <h1 className="text-2xl font-heading font-bold text-foreground">Practice Mode</h1>
        <p className="text-sm text-muted-foreground mt-1">Unlimited questions, no hearts, no XP</p>
      </div>

      <div className="space-y-3 animate-fade-up animate-fade-up-2">
        {WORLDS.map((world) => {
          const isLocked = unlockedDay < world.dayStart;
          const qCount = seedQuestions.filter((q) => {
            if (!q.day) return false;
            const w = getWorldForDay(q.day);
            return w?.id === world.id && q.day <= unlockedDay;
          }).length;

          return (
            <button
              key={world.id}
              onClick={() => !isLocked && qCount > 0 && startPractice(world.id)}
              disabled={isLocked || qCount === 0}
              className={cn(
                "w-full glass-card rounded-2xl p-4 flex items-center gap-4 text-left transition-all",
                isLocked ? "opacity-40" : "hover:scale-[1.01]"
              )}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${world.color}20` }}
              >
                <Shuffle size={22} weight="duotone" style={{ color: world.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-bold text-foreground text-sm">{world.name}</h3>
                <p className="text-[11px] text-muted-foreground">{world.description}</p>
                {!isLocked && qCount > 0 && (
                  <p className="text-[10px] text-amber-500 mt-1">{qCount} questions available</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
