"use client";

import { Fire } from "@phosphor-icons/react";

interface StreakCounterProps {
  streak: number;
}

export function StreakCounter({ streak }: StreakCounterProps) {
  const iconSize = streak >= 30 ? 44 : streak >= 14 ? 38 : streak >= 7 ? 32 : 28;

  return (
    <div className="flex items-center gap-3">
      <div className="animate-flame">
        <Fire size={iconSize} weight="duotone" className="text-amber-500" />
      </div>
      <div>
        <p className="text-3xl font-heading font-bold text-foreground leading-none">{streak}</p>
        <p className="text-xs text-muted-foreground mt-1">day streak</p>
      </div>
    </div>
  );
}
