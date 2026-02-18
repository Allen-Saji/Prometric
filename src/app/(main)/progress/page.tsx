"use client";

import { ChartLineUp } from "@phosphor-icons/react";

export default function ProgressPage() {
  return (
    <div className="px-6 py-8 max-w-md mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center space-y-5">
      <div className="w-16 h-16 rounded-2xl bg-sky-500/10 flex items-center justify-center">
        <ChartLineUp size={32} weight="duotone" className="text-sky-500" />
      </div>
      <h1 className="text-xl font-heading font-bold text-foreground">Progress & Stats</h1>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
        Detailed analytics, weak area analysis, and performance trends coming soon.
      </p>
    </div>
  );
}
