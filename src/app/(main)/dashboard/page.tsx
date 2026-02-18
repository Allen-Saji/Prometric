"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/progress-ring";
import { StreakCounter } from "@/components/streak-counter";
import { PaywallBanner } from "@/components/paywall-gate";
import { getUserProfile, getDailyProgress, getTotalStats } from "@/lib/firestore";
import { UserProfile, DailyProgress } from "@/lib/types";
import { Target, CheckCircle, TrendingUp } from "lucide-react";

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

  return (
    <div className="px-6 py-8 max-w-md mx-auto space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-[#FAFAFA]">
          Day {day}/45 — Keep going! 🔥
        </h1>
        <p className="text-[#71717A] mt-1">
          {profile?.exam} · {profile?.specialty ? profile.specialty.charAt(0).toUpperCase() + profile.specialty.slice(1) : ""}
        </p>
      </div>

      {/* Paywall banner */}
      <PaywallBanner />

      {/* Streak + Progress ring */}
      <div className="flex items-center justify-around bg-[#141416] border border-[#1F1F23] rounded-xl p-6">
        <StreakCounter streak={profile?.streak || 0} />
        <ProgressRing progress={todayComplete} />
      </div>

      {/* Start Challenge */}
      {todayComplete < 100 ? (
        <Link href="/challenge">
          <Button className="w-full bg-[#F5A524] hover:bg-[#F5A524]/90 text-black font-semibold py-7 text-lg">
            {todayProgress && todayProgress.questionsAnswered > 0
              ? `Continue Challenge (${todayProgress.questionsAnswered}/10)`
              : "Start Today's Challenge"}
          </Button>
        </Link>
      ) : (
        <Link href="/challenge/review">
          <Button variant="outline" className="w-full border-[#1F1F23] text-[#FAFAFA] py-7 text-lg">
            ✅ Today Complete — Review Answers
          </Button>
        </Link>
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#141416] border border-[#1F1F23] rounded-xl p-4 text-center">
          <Target className="mx-auto text-[#F5A524] mb-2" size={20} />
          <p className="text-xl font-bold text-[#FAFAFA]">{stats.totalAnswered}</p>
          <p className="text-xs text-[#71717A]">Answered</p>
        </div>
        <div className="bg-[#141416] border border-[#1F1F23] rounded-xl p-4 text-center">
          <CheckCircle className="mx-auto text-[#22C55E] mb-2" size={20} />
          <p className="text-xl font-bold text-[#FAFAFA]">{stats.accuracy}%</p>
          <p className="text-xs text-[#71717A]">Accuracy</p>
        </div>
        <div className="bg-[#141416] border border-[#1F1F23] rounded-xl p-4 text-center">
          <TrendingUp className="mx-auto text-[#F5A524] mb-2" size={20} />
          <p className="text-xl font-bold text-[#FAFAFA]">{profile?.longestStreak || 0}</p>
          <p className="text-xs text-[#71717A]">Best Streak</p>
        </div>
      </div>
    </div>
  );
}
