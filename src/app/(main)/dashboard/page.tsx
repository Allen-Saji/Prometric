"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PaywallBanner } from "@/components/paywall-gate";
import { XPBar } from "@/components/xp-bar";
import { HeartsDisplay } from "@/components/hearts-display";
import { HCDisplay } from "@/components/hc-display";
import { WorldMap } from "@/components/world-map";
import { getUserProfile, getTotalStats } from "@/lib/firestore";
import { getTodayXP } from "@/lib/xp";
import { getDaySchedule } from "@/lib/gulf-schedule";
import { UserProfile } from "@/lib/types";
import { ArrowRight, Lightning, Exam, Fire, CheckCircle } from "@phosphor-icons/react";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState({ totalAnswered: 0, totalCorrect: 0, accuracy: 0, daysCompleted: 0 });
  const [todayXP, setTodayXP] = useState(0);

  useEffect(() => {
    setProfile(getUserProfile());
    setStats(getTotalStats());
    setTodayXP(getTodayXP());
  }, []);

  const unlockedDay = profile?.unlockedDay || profile?.currentDay || 1;
  const daySchedule = getDaySchedule(unlockedDay);
  const handleSelectDay = (day: number) => {
    router.push(`/challenge?day=${day}`);
  };

  return (
    <div className="px-6 py-8 max-w-md mx-auto space-y-5">
      {/* Greeting + Hearts + HC */}
      <div className="animate-fade-up animate-fade-up-1">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground font-medium">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <div className="flex items-center gap-2">
            <HCDisplay />
            <HeartsDisplay />
          </div>
        </div>
        <h1 className="text-2xl font-heading font-bold text-foreground mt-1">
          {getGreeting()}
        </h1>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-xs text-muted-foreground">
            {profile?.exam} · {profile?.specialty ? profile.specialty.charAt(0).toUpperCase() + profile.specialty.slice(1) : ""}
          </span>
          {todayXP > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">
              +{todayXP} XP today
            </span>
          )}
        </div>
      </div>

      {/* XP Bar */}
      <div className="animate-fade-up animate-fade-up-1">
        <XPBar xp={profile?.xp || 0} />
      </div>

      {/* Paywall banner */}
      <PaywallBanner />

      {/* CTA — Continue Day (moved up for faster action) */}
      <div className="flex flex-col gap-3 animate-fade-up animate-fade-up-2">
        <Link href={`/challenge?day=${unlockedDay}`}>
          <button className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-amber-400 text-white font-heading font-semibold py-5 text-lg rounded-2xl hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-200">
            Continue Day {unlockedDay}: {daySchedule?.topics[0] || "Study"}
            <ArrowRight size={22} weight="bold" />
          </button>
        </Link>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/battle">
            <button className="w-full flex items-center justify-center gap-2 glass-card text-foreground font-heading font-semibold py-4 rounded-2xl hover:scale-[1.01] transition-all duration-200">
              <Lightning size={18} weight="fill" className="text-amber-500" />
              Battle
            </button>
          </Link>
          <Link href="/mock-tests">
            <button className="w-full flex items-center justify-center gap-2 glass-card text-foreground font-heading font-semibold py-4 rounded-2xl hover:scale-[1.01] transition-all duration-200">
              <Exam size={18} weight="duotone" className="text-sky-500" />
              Mock Tests
            </button>
          </Link>
        </div>
      </div>

      {/* Compact stats strip — Streak | Day | Accuracy */}
      <div className="glass-card rounded-2xl px-4 py-3 flex items-center justify-around animate-fade-up animate-fade-up-2">
        <div className="flex items-center gap-2">
          <Fire size={20} weight="fill" className="text-amber-500" />
          <div>
            <p className="text-lg font-heading font-bold text-foreground leading-none">{profile?.streak || 0}</p>
            <p className="text-[10px] text-muted-foreground">Streak</p>
          </div>
        </div>
        <div className="w-px h-8 bg-border" />
        <div className="text-center">
          <p className="text-lg font-heading font-bold text-foreground leading-none">Day {unlockedDay}</p>
          <p className="text-[10px] text-muted-foreground">of 44</p>
        </div>
        <div className="w-px h-8 bg-border" />
        <div className="flex items-center gap-2">
          <div>
            <p className="text-lg font-heading font-bold text-foreground leading-none">{stats.accuracy}%</p>
            <p className="text-[10px] text-muted-foreground">Accuracy</p>
          </div>
          <CheckCircle size={20} weight="duotone" className="text-emerald-500" />
        </div>
      </div>

      {/* World Map */}
      <div className="animate-fade-up animate-fade-up-3">
        <h2 className="text-lg font-heading font-bold text-foreground mb-3">World Map</h2>
        <WorldMap unlockedDay={unlockedDay} onSelectDay={handleSelectDay} />
      </div>
    </div>
  );
}
