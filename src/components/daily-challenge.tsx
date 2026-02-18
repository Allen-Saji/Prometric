"use client";

import { useState, useEffect, useCallback } from "react";
import { Question, QuizAnswer } from "@/lib/types";
import { selectDailyQuestions } from "@/lib/questions";
import { getUserProfile, saveQuizAnswer, updateStreak } from "@/lib/firestore";
import { QuizCard } from "./quiz-card";
import { AnswerFeedback } from "./answer-feedback";
import { ScoreSummary } from "./score-summary";
import { ArrowRight } from "@phosphor-icons/react";

export function DailyChallenge() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [completed, setCompleted] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    const profile = getUserProfile();
    const qs = selectDailyQuestions(profile);
    setQuestions(qs);
    setQuestionStartTime(Date.now());
  }, []);

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
    },
    [showResult, questions, currentIndex, questionStartTime]
  );

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setCompleted(true);
      updateStreak();
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuestionStartTime(Date.now());
  };

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
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span className="font-medium">Question {currentIndex + 1} of {questions.length}</span>
          <span className="text-emerald-500 font-medium">{answers.filter((a) => a.correct).length} correct</span>
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
