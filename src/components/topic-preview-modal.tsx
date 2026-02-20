"use client";

import { getDaySchedule, getWorldForDay } from "@/lib/gulf-schedule";
import { Lock, X, ListBullets } from "@phosphor-icons/react";

interface TopicPreviewModalProps {
  dayNumber: number;
  onClose: () => void;
}

export function TopicPreviewModal({ dayNumber, onClose }: TopicPreviewModalProps) {
  const schedule = getDaySchedule(dayNumber);
  const world = getWorldForDay(dayNumber);

  if (!schedule) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative glass-card rounded-2xl p-6 w-full max-w-sm space-y-4 animate-fade-up animate-fade-up-1"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={20} weight="bold" />
        </button>

        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${world?.color || "#F59E0B"}20` }}
          >
            <Lock size={20} weight="duotone" className="text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-foreground">Day {dayNumber}</h3>
            {world && (
              <p className="text-xs text-muted-foreground">{world.name} World</p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ListBullets size={16} weight="bold" className="text-amber-500" />
            <span className="text-sm font-heading font-semibold text-foreground">Topics</span>
          </div>
          <div className="space-y-1.5">
            {schedule.topics.map((topic, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span className="text-sm text-foreground">{topic}</span>
              </div>
            ))}
            {schedule.subtopics.map((sub, i) => (
              <div key={`sub-${i}`} className="flex items-start gap-2 pl-3">
                <div className="w-1 h-1 rounded-full bg-muted-foreground mt-1.5 shrink-0" />
                <span className="text-xs text-muted-foreground">{sub}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Complete Day {dayNumber - 1} to unlock this test
          </p>
        </div>
      </div>
    </div>
  );
}
