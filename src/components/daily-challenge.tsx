"use client";

import { useState, useEffect, useCallback } from "react";
import { Question, QuizAnswer } from "@/lib/types";
import { selectDailyQuestions } from "@/lib/questions";
import { getUserProfile, saveQuizAnswer, updateStreak } from "@/lib/firestore";
import { loseHeart, hasHearts, getHearts, getTimeUntilNextHeart } from "@/lib/hearts";
import { awardQuizXP } from "@/lib/xp";
import { QuizCard } from "./quiz-card";
import { AnswerFeedback } from "./answer-feedback";
import { ScoreSummary } from "./score-summary";
import { ArrowRight, Heart, Timer } from "@phosphor-icons/react";
import Link from "next/link";

export function DailyChallenge() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [completed, setCompleted] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [totalTime, setTotalTime] = useState(0);
  const [heartLost, setHeartLost] = useState(false);
  const [noHearts, setNoHearts] = useState(false);
  const [timeUntilHeart, setTimeUntilHeart] = useState(0);

  useEffect(() => {
    if (!hasHearts()) {
      setNoHearts(true);
      return;
    }
    const profile = getUserProfile();
    const qs = selectDailyQuestions(profile);
    setQuestions(qs);
    setQuestionStartTime(Date.now());
  }, []);

  useEffect(() => {
    if (!noHearts) return;
    const interval = setInterval(() => {
      const t = getTimeUntilNextHeart();
      setTimeUntilHeart(t);
      if (hasHearts()) {
        setNoHearts(false);
        const profile = getUserProfile();
        const qs = selectDailyQuestions(profile);
        setQuestions(qs);
        setQuestionStartTime(Date.now());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [noHearts]);

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

      if (!correct) {
        const remaining = loseHeart();
        setHeartLost(true);
        setTimeout(() => setHeartLost(false), 1000);
        if (remaining === 0) {
          setTimeout(() => setNoHearts(true), 1500);
        }
      }
    },
    [showResult, questions, currentIndex, questionStartTime]
  );

  const handleNext = () => {
    if (!hasHearts()) {
      setNoHearts(true);
      return;
    }
    if (currentIndex + 1 >= questions.length) {
      setCompleted(true);
      const streak = updateStreak();
      const correct = answers.filter((a) => a.correct).length;
      awardQuizXP(correct, questions.length, streak);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuestionStartTime(Date.now());
  };

  if (noHearts) {
    const mins = Math.floor(timeUntilHeart / 60000);
    const secs = Math.floor((timeUntilHeart % 60000) / 1000);
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 animate-fade-up animate-fade-up-1">
        <div className="w-24 h-24 rounded-full bg-rose-500/20 flex items-center justify-center">
          <Heart size={48} weight="duotone" className="text-rose-500" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-heading font-bold text-foreground">No Hearts Left</h2>
          <p className="text-muted-foreground">Hearts regenerate over time</p>
        </div>
        <div className="glass-card rounded-2xl px-8 py-4 flex items-center gap-3">
          <Timer size={24} weight="duotone" className="text-amber-500" />
          <span className="text-2xl font-heading font-bold text-foreground">
            {mins}:{secs.toString().padStart(2, "0")}
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

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-muted-foreground font-medium">Loading questions...</div>
      </div>
    );
  }

  if (completed) {
    const correct = answers.filter((a) => a.correct).length;
    return <ScoreSummary correct={correct} total={questions.length} timeSpent={totalTime} />;
  }

  const question = questions[currentIndex];
  const progressPercent = ((currentIndex + (showResult ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="space-y-6">
      {/* Heart lost flash */}
      {heartLost && (
        <div className="fixed inset-0 bg-rose-500/10 pointer-events-none z-50 animate-pulse" />
      )}

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span className="font-medium">Question {currentIndex + 1} of {questions.length}</span>
          <div className="flex items-center gap-3">
            <span className="text-emerald-500 font-medium">{answers.filter((a) => a.correct).length} correct</span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: getHearts().hearts }).map((_, i) => (
                <Heart key={i} size={14} weight="fill" className="text-rose-500" />
              ))}
            </div>
          </div>
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
