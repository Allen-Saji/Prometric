"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProgressRing } from "@/components/progress-ring";
import { StreakCounter } from "@/components/streak-counter";
import { PaywallBanner } from "@/components/paywall-gate";
import { getUserProfile, getDailyProgress, getTotalStats } from "@/lib/firestore";
import { UserProfile, DailyProgress } from "@/lib/types";
import { Target, CheckCircle, TrendUp, ArrowRight } from "@phosphor-icons/react";

const quotes = [
  "The art of medicine consists of amusing the patient while nature cures the disease. — Voltaire",
  "Wherever the art of medicine is loved, there is also a love of humanity. — Hippocrates",
  "The good physician treats the disease; the great physician treats the patient. — William Osler",
  "Medicine is a science of uncertainty and an art of probability. — William Osler",
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [todayProgress, setTodayProgress] = useState<DailyProgress | null>(null);
  const [stats, setStats] = useState({ totalAnswered: 0, totalCorrect: 0, accuracy: 0, daysCompleted: 0 });

  useEffect(() => {
    setProfile(getUserProfile());
    setTodayProgress(getDailyProgress());
    setStats(getTotalStats());
  }, []);

  const todayComplete = todayProgress ? (todayProgress.questionsAnswered / 10) * 100 : 0;
  const day = profile?.currentDay || 1;
  const quote = quotes[day % quotes.length];

  return (
    <div className="px-6 py-8 max-w-md mx-auto space-y-6">
      {/* Greeting */}
      <div className="animate-fade-up animate-fade-up-1">
        <p className="text-sm text-muted-foreground font-medium">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
        <h1 className="text-2xl font-heading font-bold text-foreground mt-1">
          {getGreeting()}
        </h1>
        <div className="flex items-center gap-2 mt-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
            Day {day}/45
          </span>
          <span className="text-xs text-muted-foreground">
            {profile?.exam} · {profile?.specialty ? profile.specialty.charAt(0).toUpperCase() + profile.specialty.slice(1) : ""}
          </span>
        </div>
      </div>

      {/* Paywall banner */}
      <PaywallBanner />

      {/* Streak + Progress ring */}
      <div className="glass-card rounded-2xl p-8 flex items-center justify-around animate-fade-up animate-fade-up-2">
        <StreakCounter streak={profile?.streak || 0} />
        <div className="w-px h-16 bg-border" />
        <ProgressRing progress={todayComplete} />
      </div>

      {/* CTA */}
      <div className="animate-fade-up animate-fade-up-3">
        {todayComplete < 100 ? (
          <Link href="/challenge">
            <button className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-amber-400 text-white font-heading font-semibold py-5 text-lg rounded-2xl hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-200">
              {todayProgress && todayProgress.questionsAnswered > 0
                ? `Continue Challenge (${todayProgress.questionsAnswered}/10)`
                : "Start Today's Challenge"}
              <ArrowRight size={22} weight="bold" />
            </button>
          </Link>
        ) : (
          <Link href="/challenge/review">
            <button className="w-full flex items-center justify-center gap-2 glass-card text-foreground font-heading font-semibold py-5 text-lg rounded-2xl hover:scale-[1.01] transition-all duration-200">
              <CheckCircle size={22} weight="duotone" className="text-emerald-500" />
              Today Complete — Review Answers
            </button>
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 animate-fade-up animate-fade-up-4">
        <div className="glass-card rounded-2xl p-4 text-center hover:scale-[1.02] transition-transform">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center mx-auto mb-2">
            <Target size={18} weight="duotone" className="text-amber-500" />
          </div>
          <p className="text-xl font-heading font-bold text-foreground">{stats.totalAnswered}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Answered</p>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center hover:scale-[1.02] transition-transform">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center mx-auto mb-2">
            <CheckCircle size={18} weight="duotone" className="text-emerald-500" />
          </div>
          <p className="text-xl font-heading font-bold text-foreground">{stats.accuracy}%</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Accuracy</p>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center hover:scale-[1.02] transition-transform">
          <div className="w-9 h-9 rounded-lg bg-sky-500/10 flex items-center justify-center mx-auto mb-2">
            <TrendUp size={18} weight="duotone" className="text-sky-500" />
          </div>
          <p className="text-xl font-heading font-bold text-foreground">{profile?.longestStreak || 0}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Best Streak</p>
        </div>
      </div>

      {/* Quote */}
      <div className="animate-fade-up animate-fade-up-5">
        <p className="text-xs text-muted-foreground/60 italic text-center leading-relaxed px-4">
          &ldquo;{quote}&rdquo;
        </p>
      </div>
    </div>
  );
}
