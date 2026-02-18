"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, ArrowLeft, Shield, Zap, BookOpen, BarChart3, Trophy, Target } from "lucide-react";

const features = [
  { icon: Zap, text: "40 more days of daily challenges (Day 6-45)" },
  { icon: BookOpen, text: "Unlimited practice mode" },
  { icon: Target, text: "Spaced repetition for weak areas" },
  { icon: BarChart3, text: "Detailed analytics & progress tracking" },
  { icon: Trophy, text: "Mock exams with timer" },
  { icon: Shield, text: "Lifetime access — no subscription" },
];

export default function UpgradePage() {
  return (
    <div className="px-6 py-8 max-w-md mx-auto space-y-8">
      <Link href="/dashboard">
        <ArrowLeft className="text-[#71717A] hover:text-[#FAFAFA]" size={20} />
      </Link>

      <div className="text-center space-y-3">
        <span className="text-5xl">🏆</span>
        <h1 className="text-2xl font-bold text-[#FAFAFA]">Unlock Your Full Journey</h1>
        <p className="text-[#71717A]">You&apos;ve built the habit. Now finish what you started.</p>
      </div>

      <div className="space-y-3">
        {features.map((feature) => (
          <div key={feature.text} className="flex items-center gap-3 p-3 bg-[#141416] border border-[#1F1F23] rounded-xl">
            <feature.icon className="text-[#F5A524] shrink-0" size={18} />
            <p className="text-sm text-[#FAFAFA]">{feature.text}</p>
            <Check className="text-[#22C55E] ml-auto shrink-0" size={16} />
          </div>
        ))}
      </div>

      <div className="text-center space-y-2">
        <p className="text-4xl font-bold text-[#FAFAFA]">$15</p>
        <p className="text-[#71717A]">One-time payment — no subscription ever</p>
      </div>

      <a href="https://checkout.lemonsqueezy.com/placeholder" target="_blank" rel="noopener noreferrer">
        <Button className="w-full bg-[#F5A524] hover:bg-[#F5A524]/90 text-black font-semibold py-7 text-lg">
          Get Full Access — $15
        </Button>
      </a>

      <p className="text-center text-xs text-[#71717A]">
        Secure payment via Lemon Squeezy. Instant access after payment.
      </p>
    </div>
  );
}
