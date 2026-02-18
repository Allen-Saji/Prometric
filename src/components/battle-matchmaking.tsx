"use client";

import { useState, useEffect } from "react";
import { MagnifyingGlass, Lightning } from "@phosphor-icons/react";

interface BattleMatchmakingProps {
  onMatchFound: () => void;
}

const fakeNames = ["Dr. Ahmed K.", "PharmD Sarah", "RPh Mohammed", "Dr. Fatima L.", "PharmD Ali"];

export function BattleMatchmaking({ onMatchFound }: BattleMatchmakingProps) {
  const [countdown, setCountdown] = useState(3);
  const [opponent, setOpponent] = useState("");

  useEffect(() => {
    setOpponent(fakeNames[Math.floor(Math.random() * fakeNames.length)]);
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      onMatchFound();
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, onMatchFound]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-fade-up animate-fade-up-1">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-amber-500/20 flex items-center justify-center animate-pulse">
          <MagnifyingGlass size={40} weight="duotone" className="text-amber-500" />
        </div>
        <div className="absolute -inset-4 rounded-full border-2 border-amber-500/30 animate-ping" />
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-heading font-bold text-foreground">Finding Opponent...</h2>
        <p className="text-muted-foreground">Matched with <span className="text-amber-500 font-semibold">{opponent}</span></p>
      </div>

      <div className="flex items-center gap-3">
        <Lightning size={28} weight="fill" className="text-amber-500" />
        <span className="text-5xl font-heading font-black text-foreground">{countdown}</span>
        <Lightning size={28} weight="fill" className="text-amber-500" />
      </div>

      <p className="text-sm text-muted-foreground">5 questions · 15 seconds each</p>
    </div>
  );
}
