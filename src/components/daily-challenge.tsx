"use client";

import { useState, useEffect, useCallback } from "react";
import { Question, QuizAnswer } from "@/lib/types";
import { selectDailyQuestions } from "@/lib/questions";
import { getUserProfile, saveUserProfile, saveQuizAnswer, updateStreak } from "@/lib/firestore";
import { awardQuizXP } from "@/lib/xp";
import { checkMasteryPass, saveDayResult, getDayAttempts } from "@/lib/mastery";
import { isOnCooldown, getRemainingCooldown, startCooldown, formatCooldownTime } from "@/lib/cooldown";
import { addHC, HC_REWARDS } from "@/lib/hero-credits";
import { recordQuestionResult } from "@/lib/ghost-rule";
import { scheduleCooldownNotification, requestNotificationPermission } from "@/lib/notifications";
import { QuizCard } from "./quiz-card";
import { AnswerFeedback } from "./answer-feedback";
import { ScoreSummary } from "./score-summary";
import { StudyGate } from "./study-gate";
import { ArrowRight, Timer, Lock } from "@phosphor-icons/react";
import Link from "next/link";

interface DailyChallengeProps {
  dayNumber?: number;
}

export function DailyChallenge({ dayNumber }: DailyChallengeProps) {
  const [phase, setPhase] = useState<"gate" | "quiz" | "completed">("gate");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [totalTime, setTotalTime] = useState(0);
  const [cooldownMs, setCooldownMs] = useState(0);
  const [activeDayNumber, setActiveDayNumber] = useState(1);

  useEffect(() => {
    const profile = getUserProfile();
    const day = dayNumber || profile?.unlockedDay || profile?.currentDay || 1;
    setActiveDayNumber(day);

    // Check cooldown
    const remaining = getRemainingCooldown(day);
    if (remaining > 0) {
      setCooldownMs(remaining);
    }
  }, [dayNumber]);

  // Cooldown timer
  useEffect(() => {
    if (cooldownMs <= 0) return;
    const interval = setInterval(() => {
      const remaining = getRemainingCooldown(activeDayNumber);
      if (remaining <= 0) {
        setCooldownMs(0);
      } else {
        setCooldownMs(remaining);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownMs, activeDayNumber]);

  const startQuiz = useCallback(() => {
    if (isOnCooldown(activeDayNumber)) {
      setCooldownMs(getRemainingCooldown(activeDayNumber));
      return;
    }
    const profile = getUserProfile();
    const qs = selectDailyQuestions(profile, 50, activeDayNumber);
    setQuestions(qs);
    setCurrentIndex(0);
    setAnswers([]);
    setTotalTime(0);
    setQuestionStartTime(Date.now());
    setPhase("quiz");
  }, [activeDayNumber]);

  const handleSelect = useCallback(
    (index: number) => {
      if (showResult || questions.length === 0) return;
      setSelectedAnswer(index);
      setShowResult(true);

      const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
      const correct = index === questions[currentIndex].correctAnswer;

      const answer: QuizAnswer = {
        questionId: questions[currentIndex].id,
        selectedAnswer: index,
        correct,
        timeSpent,
      };

      setAnswers((prev) => [...prev, answer]);
      saveQuizAnswer(answer);
      setTotalTime((prev) => prev + timeSpent);

      // Record for ghost rule
      recordQuestionResult(questions[currentIndex].id, activeDayNumber, correct);
    },
    [showResult, questions, currentIndex, questionStartTime, activeDayNumber]
  );

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      // Quiz complete — check mastery
      const correct = answers.filter((a) => a.correct).length;
      const passed = checkMasteryPass(correct, questions.length);
      const attempts = getDayAttempts(activeDayNumber) + 1;

      // Save day result
      saveDayResult(activeDayNumber, correct, questions.length);

      if (passed) {
        // Unlock next day
        const profile = getUserProfile();
        if (profile) {
          profile.unlockedDay = Math.max(profile.unlockedDay || 1, activeDayNumber + 1);
          profile.currentDay = Math.max(profile.currentDay, activeDayNumber + 1);
          saveUserProfile(profile);
        }

        // Award HC
        addHC(HC_REWARDS.DAILY_PASS, `Day ${activeDayNumber} passed`);

        // Award XP
        const streak = updateStreak();
        awardQuizXP(correct, questions.length, streak);
      } else {
        // Start cooldown
        const cd = startCooldown(activeDayNumber, attempts);
        setCooldownMs(cd.lockedUntil - Date.now());

        // Request notification permission and schedule
        requestNotificationPermission().then(() => {
          scheduleCooldownNotification(cd.lockedUntil);
        });
      }

      setPhase("completed");
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuestionStartTime(Date.now());
  };

  // Cooldown screen
  if (cooldownMs > 0 && phase !== "completed") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 animate-fade-up animate-fade-up-1">
        <div className="w-24 h-24 rounded-full bg-rose-500/20 flex items-center justify-center">
          <Lock size={48} weight="duotone" className="text-rose-500" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-heading font-bold text-foreground">Cooldown Active</h2>
          <p className="text-muted-foreground text-sm">Go back and study the topics before retrying</p>
        </div>
        <div className="glass-card rounded-2xl px-8 py-4 flex items-center gap-3">
          <Timer size={24} weight="duotone" className="text-amber-500" />
          <span className="text-2xl font-heading font-bold text-foreground">
            {formatCooldownTime(cooldownMs)}
          </span>
        </div>
        <Link href="/dashboard">
          <button className="glass-card text-foreground font-medium px-8 py-3 rounded-xl hover:scale-[1.01] transition-all duration-200">
            Back to Dashboard
          </button>
        </Link>
      </div>
    );
  }

  // Study gate
  if (phase === "gate") {
    return <StudyGate dayNumber={activeDayNumber} onStart={startQuiz} />;
  }

  // Loading
  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-muted-foreground font-medium">Loading questions...</div>
      </div>
    );
  }

  // Completed
  if (phase === "completed") {
    const correct = answers.filter((a) => a.correct).length;
    const passed = checkMasteryPass(correct, questions.length);
    return (
      <ScoreSummary
        correct={correct}
        total={questions.length}
        timeSpent={totalTime}
        passed={passed}
        dayNumber={activeDayNumber}
        cooldownMs={cooldownMs}
      />
    );
  }

  // Quiz in progress
  const question = questions[currentIndex];
  const progressPercent = ((currentIndex + (showResult ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span className="font-medium">Question {currentIndex + 1} of {questions.length}</span>
          <span className="text-emerald-500 font-medium">
            {answers.filter((a) => a.correct).length} correct
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-border/50 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <QuizCard
        question={question}
        selectedAnswer={selectedAnswer}
        onSelect={handleSelect}
        showResult={showResult}
      />

      {/* Feedback */}
      <AnswerFeedback
        correct={selectedAnswer === question.correctAnswer}
        explanation={question.explanation}
        visible={showResult}
      />

      {/* Next button */}
      {showResult && (
        <button
          onClick={handleNext}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 text-white font-heading font-semibold py-4 text-lg rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-200"
        >
          {currentIndex + 1 >= questions.length ? "See Results" : "Next Question"}
          <ArrowRight size={20} weight="bold" />
        </button>
      )}
    </div>
  );
}
