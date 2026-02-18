"use client";

import { Timer } from "@phosphor-icons/react";

export default function PracticePage() {
  return (
    <div className="px-6 py-8 max-w-md mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center space-y-5">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center">
        <Timer size={32} weight="duotone" className="text-amber-500" />
      </div>
      <h1 className="text-xl font-heading font-bold text-foreground">Practice Mode</h1>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
        Unlimited practice questions coming soon. Complete your daily challenge first!
      </p>
    </div>
  );
}
