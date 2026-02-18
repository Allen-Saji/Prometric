"use client";

import { getLevelInfo } from "@/lib/xp";
import { LevelIcon } from "@/components/level-icon";

interface XPBarProps {
  xp: number;
}

export function XPBar({ xp }: XPBarProps) {
  const level = getLevelInfo(xp);

  return (
    <div className="glass-card rounded-2xl p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LevelIcon name={level.icon} size={24} className="text-amber-500" />
          <div>
            <p className="text-sm font-heading font-bold text-foreground">
              Level {level.level} — {level.title}
            </p>
            <p className="text-xs text-muted-foreground">{xp} XP total</p>
          </div>
        </div>
        {level.maxXP !== Infinity && (
          <span className="text-xs text-amber-500 font-medium">
            {level.maxXP - xp} XP to next
          </span>
        )}
      </div>
      <div className="w-full h-2.5 rounded-full bg-border/50 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-700 ease-out"
          style={{ width: `${level.progress}%` }}
        />
      </div>
    </div>
  );
}
