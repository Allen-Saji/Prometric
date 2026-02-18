"use client";

import Link from "next/link";
import { Trophy, X, Equals, Lightning } from "@phosphor-icons/react";

interface BattleResultProps {
  playerScore: number;
  opponentScore: number;
  totalQuestions: number;
  xpEarned: number;
}

export function BattleResult({ playerScore, opponentScore, totalQuestions, xpEarned }: BattleResultProps) {
  const won = playerScore > opponentScore;
  const draw = playerScore === opponentScore;
  const lost = playerScore < opponentScore;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-fade-up animate-fade-up-1">
      {/* Result icon */}
      <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
        won ? "bg-amber-500/20" : draw ? "bg-sky-500/20" : "bg-rose-500/20"
      }`}>
        {won ? (
          <Trophy size={48} weight="duotone" className="text-amber-500" />
        ) : draw ? (
          <Equals size={48} weight="bold" className="text-sky-500" />
        ) : (
          <X size={48} weight="bold" className="text-rose-500" />
        )}
      </div>

      {/* Result text */}
      <div className="text-center space-y-1">
        <h2 className={`text-3xl font-heading font-black ${
          won ? "text-amber-500" : draw ? "text-sky-500" : "text-rose-500"
        }`}>
          {won ? "VICTORY!" : draw ? "DRAW!" : "DEFEAT"}
        </h2>
        <p className="text-muted-foreground">
          {won ? "You crushed it!" : draw ? "So close!" : "Better luck next time!"}
        </p>
      </div>

      {/* Score comparison */}
      <div className="flex items-center gap-6">
        <div className="text-center">
          <p className="text-4xl font-heading font-black text-foreground">{playerScore}</p>
          <p className="text-xs text-muted-foreground mt-1">You</p>
        </div>
        <div className="text-2xl font-heading font-bold text-muted-foreground">vs</div>
        <div className="text-center">
          <p className="text-4xl font-heading font-black text-muted-foreground">{opponentScore}</p>
          <p className="text-xs text-muted-foreground mt-1">Opponent</p>
        </div>
      </div>

      {/* XP earned */}
      <div className="glass-card rounded-2xl px-6 py-4 flex items-center gap-3">
        <Lightning size={24} weight="fill" className="text-amber-500" />
        <span className="text-lg font-heading font-bold text-amber-500">+{xpEarned} XP</span>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <Link href="/battle">
          <button className="w-full bg-gradient-to-r from-amber-500 to-amber-400 text-white font-heading font-semibold py-4 rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-200">
            Battle Again
          </button>
        </Link>
        <Link href="/dashboard">
          <button className="w-full glass-card text-foreground font-medium py-4 rounded-xl hover:scale-[1.01] transition-all duration-200">
            Back to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}
