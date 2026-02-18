"use client";

import Link from "next/link";
import { getUserProfile } from "@/lib/firestore";
import { Star } from "@phosphor-icons/react";

export function PaywallBanner() {
  const profile = getUserProfile();
  if (!profile || profile.currentDay < 6 || profile.paidAt) return null;

  return (
    <div className="glass-card rounded-2xl p-4 !border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-transparent">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
          <Star size={20} weight="duotone" className="text-amber-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-heading font-semibold text-foreground">Free trial ended</p>
          <p className="text-xs text-muted-foreground">Unlock 40 more days for just $15</p>
        </div>
        <Link href="/upgrade">
          <button className="shrink-0 bg-gradient-to-r from-amber-500 to-amber-400 text-white text-sm font-heading font-semibold px-4 py-2 rounded-lg hover:-translate-y-0.5 hover:shadow-md hover:shadow-amber-500/20 transition-all duration-200">
            Upgrade
          </button>
        </Link>
      </div>
    </div>
  );
}
