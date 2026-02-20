"use client";

import { getDaysForWorld } from "@/lib/gulf-schedule";
import { isDayPassed, getDayResult } from "@/lib/mastery";
import { Lock, CheckCircle, Play, X } from "@phosphor-icons/react";
import { TopicPreviewModal } from "./topic-preview-modal";
import { useState } from "react";

interface DayListProps {
  worldId: string;
  unlockedDay: number;
  onSelectDay: (day: number) => void;
}

export function DayList({ worldId, unlockedDay, onSelectDay }: DayListProps) {
  const days = getDaysForWorld(worldId);
  const [previewDay, setPreviewDay] = useState<number | null>(null);

  return (
    <>
      <div className="space-y-1.5 py-2">
        {days.map((gulfDay) => {
          const isLocked = gulfDay.day > unlockedDay;
          const isPassed = isDayPassed(gulfDay.day);
          const isCurrent = gulfDay.day === unlockedDay;
          const result = getDayResult(gulfDay.day);
          const hasFailed = result && !result.passed;

          return (
            <button
              key={gulfDay.day}
              onClick={() => {
                if (isLocked) {
                  setPreviewDay(gulfDay.day);
                } else {
                  onSelectDay(gulfDay.day);
                }
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                isCurrent
                  ? "bg-amber-500/10 border border-amber-500/30"
                  : isLocked
                  ? "opacity-50"
                  : "hover:bg-foreground/5"
              }`}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                {isLocked ? (
                  <Lock size={16} weight="duotone" className="text-muted-foreground" />
                ) : isPassed ? (
                  <CheckCircle size={18} weight="fill" className="text-emerald-500" />
                ) : hasFailed ? (
                  <X size={16} weight="bold" className="text-rose-500" />
                ) : (
                  <Play size={16} weight="fill" className="text-amber-500" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Day {gulfDay.day}</p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {gulfDay.topics.join(", ")}
                </p>
              </div>

              {result && (
                <span className={`text-xs font-medium shrink-0 ${isPassed ? "text-emerald-500" : "text-rose-500"}`}>
                  {result.score}/{result.total}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {previewDay !== null && (
        <TopicPreviewModal
          dayNumber={previewDay}
          onClose={() => setPreviewDay(null)}
        />
      )}
    </>
  );
}
