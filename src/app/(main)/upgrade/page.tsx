"use client";

import Link from "next/link";
import { ArrowLeft, Lightning, BookOpen, Target, ChartLineUp, Trophy, ShieldCheck, CheckCircle } from "@phosphor-icons/react";

const features = [
  { icon: Lightning, text: "40 more days of daily challenges (Day 6-45)" },
  { icon: BookOpen, text: "Unlimited practice mode" },
  { icon: Target, text: "Spaced repetition for weak areas" },
  { icon: ChartLineUp, text: "Detailed analytics & progress tracking" },
  { icon: Trophy, text: "Mock exams with timer" },
  { icon: ShieldCheck, text: "Lifetime access — no subscription" },
];

export default function UpgradePage() {
  return (
    <div className="px-6 py-8 max-w-md mx-auto space-y-8">
      <Link href="/dashboard" className="inline-flex p-2 -ml-2 rounded-lg hover:bg-accent transition-colors">
        <ArrowLeft size={20} weight="bold" className="text-muted-foreground" />
      </Link>

      <div className="text-center space-y-4 animate-fade-up animate-fade-up-1">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
          <Trophy size={32} weight="duotone" className="text-white" />
        </div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Unlock Your Full Journey</h1>
        <p className="text-muted-foreground text-sm">You&apos;ve built the habit. Now finish what you started.</p>
      </div>

      <div className="space-y-2.5 animate-fade-up animate-fade-up-2">
        {features.map((feature) => (
          <div key={feature.text} className="flex items-center gap-3.5 p-4 glass-card rounded-2xl">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
              <feature.icon size={18} weight="duotone" className="text-amber-500" />
            </div>
            <p className="text-sm text-foreground font-medium flex-1">{feature.text}</p>
            <CheckCircle size={18} weight="duotone" className="text-emerald-500 shrink-0" />
          </div>
        ))}
      </div>

      {/* Price card */}
      <div className="glass-card rounded-2xl p-8 text-center !border-amber-500/20 bg-gradient-to-b from-amber-500/5 to-transparent animate-fade-up animate-fade-up-3">
        <p className="text-5xl font-heading font-extrabold text-foreground">$15</p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <span className="text-xs font-medium bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-full border border-amber-500/20">One-time payment</span>
        </div>
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
          <span>No subscription</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>Instant access</span>
        </div>
      </div>

      <div className="animate-fade-up animate-fade-up-4">
        <a href="https://checkout.lemonsqueezy.com/placeholder" target="_blank" rel="noopener noreferrer">
          <button className="w-full bg-gradient-to-r from-amber-500 to-amber-400 text-white font-heading font-bold py-5 text-lg rounded-xl hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-200">
            Get Full Access — $15
          </button>
        </a>
        <p className="text-center text-xs text-muted-foreground mt-3">
          Secure payment via Lemon Squeezy
        </p>
      </div>
    </div>
  );
}
