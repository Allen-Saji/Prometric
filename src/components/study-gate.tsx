"use client";

import { getDaySchedule, getWorldForDay } from "@/lib/gulf-schedule";
import { BookOpen, TelegramLogo, ArrowRight, ListBullets } from "@phosphor-icons/react";

const TELEGRAM_STUDY_GROUP = "https://t.me/prometric_hero";

interface StudyGateProps {
  dayNumber: number;
  onStart: () => void;
}

export function StudyGate({ dayNumber, onStart }: StudyGateProps) {
  const schedule = getDaySchedule(dayNumber);
  const world = getWorldForDay(dayNumber);

  if (!schedule) return null;

  return (
    <div className="flex flex-col items-center text-center space-y-6 animate-fade-up animate-fade-up-1">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${world?.color || "#F59E0B"}20` }}
      >
        <BookOpen size={40} weight="duotone" style={{ color: world?.color || "#F59E0B" }} />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-heading font-bold text-foreground">
          Day {dayNumber} Test
        </h2>
        {world && (
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border"
            style={{ color: world.color, borderColor: `${world.color}40`, backgroundColor: `${world.color}10` }}
          >
            {world.name} World
          </span>
        )}
      </div>

      <div className="glass-card rounded-2xl p-5 w-full text-left space-y-4">
        <div className="flex items-center gap-2">
          <ListBullets size={20} weight="bold" className="text-amber-500" />
          <h3 className="font-heading font-semibold text-foreground">Topics to Study</h3>
        </div>
        <div className="space-y-2">
          {schedule.topics.map((topic, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
              <span className="text-sm text-foreground">{topic}</span>
            </div>
          ))}
          {schedule.subtopics.map((sub, i) => (
            <div key={`sub-${i}`} className="flex items-start gap-2 pl-3">
              <div className="w-1 h-1 rounded-full bg-muted-foreground mt-2 shrink-0" />
              <span className="text-xs text-muted-foreground">{sub}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-4 w-full">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TelegramLogo size={18} weight="duotone" className="text-sky-500" />
          <span>Need help? </span>
          <a
            href={TELEGRAM_STUDY_GROUP}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-500 hover:underline font-medium"
          >
            Join the study group
          </a>
        </div>
      </div>

      <div className="w-full space-y-3">
        <p className="text-xs text-muted-foreground">
          You need 80% to pass and unlock the next day
        </p>
        <button
          onClick={onStart}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-amber-400 text-white font-heading font-semibold py-5 text-lg rounded-2xl hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-200"
        >
          Start Test
          <ArrowRight size={22} weight="bold" />
        </button>
      </div>
    </div>
  );
}
