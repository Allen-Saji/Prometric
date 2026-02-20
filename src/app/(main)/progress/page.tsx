"use client";

import { useEffect, useState } from "react";
import { getUserProfile, getTotalStats, getAllProgress } from "@/lib/firestore";
import { getWeakTopics } from "@/lib/ghost-rule";
import { WORLDS, getWorldProgress } from "@/lib/gulf-schedule";
import { MockTestResult } from "@/lib/types";
import { ChartLineUp, Target, Fire, Trophy, Warning } from "@phosphor-icons/react";

function getMockTestResults(): MockTestResult[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("mock-test-results");
  return data ? JSON.parse(data) : [];
}

export default function ProgressPage() {
  const [unlockedDay, setUnlockedDay] = useState(1);
  const [stats, setStats] = useState({ totalAnswered: 0, totalCorrect: 0, accuracy: 0, daysCompleted: 0 });
  const [weakTopics, setWeakTopics] = useState<{ topic: string; accuracy: number }[]>([]);
  const [mockResults, setMockResults] = useState<MockTestResult[]>([]);
  const [streak, setStreak] = useState(0);
  const [streakCalendar, setStreakCalendar] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const profile = getUserProfile();
    const ud = profile?.unlockedDay || profile?.currentDay || 1;
    setUnlockedDay(ud);
    setStats(getTotalStats());
    setWeakTopics(getWeakTopics(ud));
    setMockResults(getMockTestResults());
    setStreak(profile?.streak || 0);

    // Build streak calendar from daily progress
    const allProgress = getAllProgress();
    const cal: Record<string, boolean> = {};
    for (const [date, progress] of Object.entries(allProgress)) {
      cal[date] = progress.questionsAnswered >= 10;
    }
    setStreakCalendar(cal);
  }, []);

  // Generate last 30 days for calendar
  const calendarDays: { date: string; active: boolean }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const key = d.toISOString().split("T")[0];
    calendarDays.push({ date: key, active: !!streakCalendar[key] });
  }

  return (
    <div className="px-6 py-8 max-w-md mx-auto space-y-6">
      <div className="animate-fade-up animate-fade-up-1">
        <h1 className="text-2xl font-heading font-bold text-foreground">Progress</h1>
        <p className="text-sm text-muted-foreground mt-1">Track your journey</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 animate-fade-up animate-fade-up-1">
        <div className="glass-card rounded-2xl p-4 text-center">
          <Target size={20} weight="duotone" className="text-amber-500 mx-auto mb-1" />
          <p className="text-lg font-heading font-bold text-foreground">{stats.totalAnswered}</p>
          <p className="text-[10px] text-muted-foreground">Questions</p>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center">
          <ChartLineUp size={20} weight="duotone" className="text-emerald-500 mx-auto mb-1" />
          <p className="text-lg font-heading font-bold text-foreground">{stats.accuracy}%</p>
          <p className="text-[10px] text-muted-foreground">Accuracy</p>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center">
          <Fire size={20} weight="fill" className="text-amber-500 mx-auto mb-1" />
          <p className="text-lg font-heading font-bold text-foreground">{streak}</p>
          <p className="text-[10px] text-muted-foreground">Streak</p>
        </div>
      </div>

      {/* Streak Calendar */}
      <div className="glass-card rounded-2xl p-5 animate-fade-up animate-fade-up-2">
        <h3 className="font-heading font-bold text-foreground text-sm mb-3">Last 30 Days</h3>
        <div className="grid grid-cols-10 gap-1.5">
          {calendarDays.map((d) => (
            <div
              key={d.date}
              className={`w-full aspect-square rounded-sm ${
                d.active ? "bg-emerald-500" : "bg-border/50"
              }`}
              title={d.date}
            />
          ))}
        </div>
      </div>

      {/* Per-world accuracy */}
      <div className="glass-card rounded-2xl p-5 space-y-3 animate-fade-up animate-fade-up-2">
        <h3 className="font-heading font-bold text-foreground text-sm">World Progress</h3>
        {WORLDS.map((world) => {
          const progress = getWorldProgress(unlockedDay, world.id);
          const isLocked = unlockedDay < world.dayStart;
          if (isLocked) return null;
          return (
            <div key={world.id} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-20 truncate">{world.name}</span>
              <div className="flex-1 h-2.5 rounded-full bg-border/50 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress.percent}%`, backgroundColor: world.color }}
                />
              </div>
              <span className="text-xs font-medium text-foreground w-10 text-right">{progress.percent}%</span>
            </div>
          );
        })}
      </div>

      {/* Weak topics */}
      {weakTopics.length > 0 && (
        <div className="glass-card rounded-2xl p-5 space-y-3 animate-fade-up animate-fade-up-3">
          <div className="flex items-center gap-2">
            <Warning size={18} weight="duotone" className="text-rose-500" />
            <h3 className="font-heading font-bold text-foreground text-sm">Weak Topics</h3>
          </div>
          {weakTopics.slice(0, 5).map((t) => (
            <div key={t.topic} className="flex items-center justify-between">
              <span className="text-xs text-foreground">{t.topic}</span>
              <span className={`text-xs font-medium ${t.accuracy < 50 ? "text-rose-500" : t.accuracy < 70 ? "text-amber-500" : "text-emerald-500"}`}>
                {t.accuracy}%
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Mock test history */}
      {mockResults.length > 0 && (
        <div className="glass-card rounded-2xl p-5 space-y-3 animate-fade-up animate-fade-up-3">
          <div className="flex items-center gap-2">
            <Trophy size={18} weight="duotone" className="text-amber-500" />
            <h3 className="font-heading font-bold text-foreground text-sm">Mock Test History</h3>
          </div>
          {mockResults.slice(-5).reverse().map((r) => (
            <div key={r.id} className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-foreground">
                  {r.type === "final" ? "Final Boss" : `Milestone ${r.milestone}`}
                </span>
                <span className="text-[10px] text-muted-foreground ml-2">
                  {new Date(r.completedAt).toLocaleDateString()}
                </span>
              </div>
              <span className={`text-xs font-bold ${Math.round((r.score / r.total) * 100) >= 80 ? "text-emerald-500" : "text-rose-500"}`}>
                {Math.round((r.score / r.total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
