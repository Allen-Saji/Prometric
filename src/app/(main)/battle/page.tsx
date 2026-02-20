"use client";

import { useState, useCallback } from "react";
import { Sword, Lightning, Trophy, Equals } from "@phosphor-icons/react";
import { BattleMatchmaking } from "@/components/battle-matchmaking";
import { BattleQuestion } from "@/components/battle-question";
import { BattleResult } from "@/components/battle-result";
import { getUserProfile } from "@/lib/firestore";
import { seedQuestions } from "@/lib/seed-questions";
import { getWorldForDay } from "@/lib/gulf-schedule";
import { addXP } from "@/lib/xp";
import { addHC, HC_REWARDS } from "@/lib/hero-credits";
import { Question } from "@/lib/types";

type BattleState = "idle" | "matchmaking" | "battle" | "result";

export default function BattlePage() {
  const [state, setState] = useState<BattleState>("idle");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);

  const startMatchmaking = () => {
    const profile = getUserProfile();
    const unlockedDay = profile?.unlockedDay || profile?.currentDay || 1;

    // Filter questions to unlocked worlds only
    const eligible = seedQuestions.filter((q) => {
      if (!q.day) return true; // legacy untagged questions are always available
      return q.day <= unlockedDay;
    });

    // Shuffle and pick 5
    const shuffled = [...eligible].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, 5));
    setCurrentQ(0);
    setPlayerScore(0);
    setState("matchmaking");
  };

  const onMatchFound = useCallback(() => {
    setState("battle");
  }, []);

  const onAnswer = useCallback((correct: boolean) => {
    if (correct) setPlayerScore((p) => p + 1);
    setTimeout(() => {
      if (currentQ + 1 >= 5) {
        const oppScore = Math.floor(Math.random() * 3) + 2;
        setOpponentScore(oppScore);
        const finalPlayerScore = playerScore + (correct ? 1 : 0);
        let xp = 20;
        if (finalPlayerScore > oppScore) xp = 100;
        else if (finalPlayerScore === oppScore) xp = 50;
        setXpEarned(xp);
        const type = finalPlayerScore > oppScore ? "battle_win" : finalPlayerScore === oppScore ? "battle_draw" : "battle_loss";
        addXP(type as "battle_win" | "battle_loss" | "battle_draw", xp);

        // Award HC for wins
        if (finalPlayerScore > oppScore) {
          addHC(HC_REWARDS.DUEL_WIN, "Battle win");
        }

        setPlayerScore(finalPlayerScore);
        setState("result");
      } else {
        setCurrentQ((q) => q + 1);
      }
    }, 200);
  }, [currentQ, playerScore]);

  if (state === "matchmaking") {
    return (
      <div className="px-6 py-8 max-w-md mx-auto">
        <BattleMatchmaking onMatchFound={onMatchFound} />
      </div>
    );
  }

  if (state === "battle" && questions[currentQ]) {
    return (
      <div className="px-6 py-8 max-w-md mx-auto">
        <BattleQuestion
          question={questions[currentQ]}
          questionNumber={currentQ + 1}
          totalQuestions={5}
          onAnswer={onAnswer}
        />
      </div>
    );
  }

  if (state === "result") {
    return (
      <div className="px-6 py-8 max-w-md mx-auto">
        <BattleResult
          playerScore={playerScore}
          opponentScore={opponentScore}
          totalQuestions={5}
          xpEarned={xpEarned}
        />
      </div>
    );
  }

  return (
    <div className="px-6 py-8 max-w-md mx-auto space-y-8">
      <div className="animate-fade-up animate-fade-up-1">
        <h1 className="text-2xl font-heading font-bold text-foreground">1v1 Battle</h1>
        <p className="text-sm text-muted-foreground mt-1">Challenge a random opponent in a rapid-fire quiz</p>
      </div>

      <div className="flex flex-col items-center space-y-6 animate-fade-up animate-fade-up-2">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-400/10 flex items-center justify-center">
          <Sword size={56} weight="duotone" className="text-amber-500" />
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-lg font-heading font-semibold text-foreground">Ready to Battle?</h2>
          <p className="text-sm text-muted-foreground">5 questions · 15 seconds each · Winner takes XP + HC</p>
        </div>

        <div className="glass-card rounded-2xl p-4 w-full space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1.5"><Trophy size={16} weight="duotone" className="text-amber-500" /> Win</span>
            <span className="font-heading font-bold text-amber-500">+100 XP +3 HC</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1.5"><Equals size={16} weight="bold" className="text-sky-500" /> Draw</span>
            <span className="font-heading font-bold text-sky-500">+50 XP</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1.5"><Sword size={16} weight="duotone" className="text-zinc-400" /> Lose</span>
            <span className="font-heading font-bold text-muted-foreground">+20 XP</span>
          </div>
        </div>

        <button
          onClick={startMatchmaking}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-amber-400 text-white font-heading font-semibold py-5 text-lg rounded-2xl hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-200"
        >
          <Lightning size={24} weight="fill" />
          Find Opponent
        </button>
      </div>
    </div>
  );
}
