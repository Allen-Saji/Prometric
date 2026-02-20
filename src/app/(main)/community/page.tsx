"use client";

import { useState, useEffect } from "react";
import { getUserProfile } from "@/lib/firestore";
import { getDaySchedule } from "@/lib/gulf-schedule";
import { LoungeThread } from "@/components/lounge-thread";
import { ChatCircle, ArrowLeft, ChatTeardrop } from "@phosphor-icons/react";

export default function CommunityPage() {
  const [unlockedDay, setUnlockedDay] = useState(1);
  const [activeThread, setActiveThread] = useState<number | null>(null);

  useEffect(() => {
    const profile = getUserProfile();
    setUnlockedDay(profile?.unlockedDay || profile?.currentDay || 1);
  }, []);

  if (activeThread !== null) {
    const schedule = getDaySchedule(activeThread);
    return (
      <div className="px-6 py-8 max-w-md mx-auto space-y-4">
        <button
          onClick={() => setActiveThread(null)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} weight="bold" />
          Back to Lounge
        </button>
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground">Day {activeThread}</h1>
          <p className="text-sm text-muted-foreground">{schedule?.topics.join(", ") || "Discussion"}</p>
        </div>
        <LoungeThread dayNumber={activeThread} />
      </div>
    );
  }

  return (
    <div className="px-6 py-8 max-w-md mx-auto space-y-6">
      <div className="animate-fade-up animate-fade-up-1">
        <h1 className="text-2xl font-heading font-bold text-foreground">The Lounge</h1>
        <p className="text-sm text-muted-foreground mt-1">Discuss topics with fellow students</p>
      </div>

      <div className="space-y-2 animate-fade-up animate-fade-up-2">
        {Array.from({ length: unlockedDay }, (_, i) => i + 1).map((day) => {
          const schedule = getDaySchedule(day);
          return (
            <button
              key={day}
              onClick={() => setActiveThread(day)}
              className="w-full glass-card rounded-xl px-4 py-3 flex items-center gap-3 text-left hover:scale-[1.01] transition-all"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                <ChatTeardrop size={18} weight="duotone" className="text-amber-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-heading font-semibold text-foreground">Day {day}</p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {schedule?.topics.join(", ") || "Discussion"}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {unlockedDay === 0 && (
        <div className="flex flex-col items-center text-center space-y-4 pt-8">
          <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center">
            <ChatCircle size={40} weight="duotone" className="text-amber-500" />
          </div>
          <p className="text-sm text-muted-foreground">Complete Day 1 to unlock the Lounge</p>
        </div>
      )}
    </div>
  );
}
