"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getUserProfile } from "@/lib/firestore";
import { Lock } from "lucide-react";

export function PaywallBanner() {
  const profile = getUserProfile();
  if (!profile || profile.currentDay < 6 || profile.paidAt) return null;

  return (
    <div className="bg-gradient-to-r from-[#F5A524]/10 to-[#F5A524]/5 border border-[#F5A524]/20 rounded-xl p-4">
      <div className="flex items-center gap-3">
        <Lock className="text-[#F5A524] shrink-0" size={20} />
        <div className="flex-1">
          <p className="text-sm font-medium text-[#FAFAFA]">Free trial ended</p>
          <p className="text-xs text-[#71717A]">Unlock the remaining 40 days for just $15</p>
        </div>
        <Link href="/upgrade">
          <Button size="sm" className="bg-[#F5A524] hover:bg-[#F5A524]/90 text-black font-semibold">
            Upgrade
          </Button>
        </Link>
      </div>
    </div>
  );
}
