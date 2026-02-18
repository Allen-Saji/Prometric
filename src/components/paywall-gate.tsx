"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getUserProfile } from "@/lib/firestore";
import { Lock } from "lucide-react";

export function PaywallBanner() {
  const profile = getUserProfile();
  if (!profile || profile.currentDay < 6 || profile.paidAt) return null;

  return (
    <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-4">
      <div className="flex items-center gap-3">
        <Lock className="text-primary shrink-0" size={20} />
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">Free trial ended</p>
          <p className="text-xs text-muted-foreground">Unlock the remaining 40 days for just $15</p>
        </div>
        <Link href="/upgrade">
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-black font-semibold">
            Upgrade
          </Button>
        </Link>
      </div>
    </div>
  );
}
