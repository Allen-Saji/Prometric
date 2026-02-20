"use client";

import { useState } from "react";
import { WORLDS, getWorldProgress } from "@/lib/gulf-schedule";
import { DayList } from "./day-list";
import { Lock, CaretDown, CaretUp, CheckCircle, Flask, Heartbeat, Calculator, Drop, Brain, Shield, Scroll } from "@phosphor-icons/react";

const WORLD_ICONS: Record<string, typeof Flask> = {
  Flask, Heartbeat, Calculator, Drop, Brain, Shield, Scroll,
};

interface WorldMapProps {
  unlockedDay: number;
  onSelectDay: (day: number) => void;
}

export function WorldMap({ unlockedDay, onSelectDay }: WorldMapProps) {
  const [expandedWorld, setExpandedWorld] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {WORLDS.map((world) => {
        const progress = getWorldProgress(unlockedDay, world.id);
        const isLocked = unlockedDay < world.dayStart;
        const isCurrent = unlockedDay >= world.dayStart && unlockedDay <= world.dayEnd;
        const isComplete = progress.percent === 100;
        const isExpanded = expandedWorld === world.id;
        const Icon = WORLD_ICONS[world.icon] || Flask;

        return (
          <div key={world.id}>
            <button
              onClick={() => setExpandedWorld(isExpanded ? null : world.id)}
              className={`w-full glass-card rounded-2xl p-4 text-left transition-all duration-200 ${
                isCurrent ? "ring-2 ring-amber-500/50 shadow-lg shadow-amber-500/10" : ""
              } ${isLocked ? "opacity-50" : "hover:scale-[1.01]"}`}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${world.color}20` }}
                >
                  {isLocked ? (
                    <Lock size={24} weight="duotone" className="text-muted-foreground" />
                  ) : (
                    <Icon size={24} weight="duotone" style={{ color: world.color }} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-foreground text-sm truncate">
                      {world.name}
                    </h3>
                    {isComplete && <CheckCircle size={16} weight="fill" className="text-emerald-500 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">{world.description}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] text-muted-foreground">
                      Days {world.dayStart}-{world.dayEnd}
                    </span>
                    {!isLocked && (
                      <>
                        <div className="w-16 h-1.5 rounded-full bg-border/50 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${progress.percent}%`, backgroundColor: world.color }}
                          />
                        </div>
                        <span className="text-[10px] font-medium" style={{ color: world.color }}>
                          {progress.percent}%
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {!isLocked && (
                  <div className="shrink-0">
                    {isExpanded ? (
                      <CaretUp size={18} className="text-muted-foreground" />
                    ) : (
                      <CaretDown size={18} className="text-muted-foreground" />
                    )}
                  </div>
                )}
              </div>
            </button>

            {isExpanded && !isLocked && (
              <div className="mt-1 ml-4 animate-fade-up animate-fade-up-1">
                <DayList worldId={world.id} unlockedDay={unlockedDay} onSelectDay={onSelectDay} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
