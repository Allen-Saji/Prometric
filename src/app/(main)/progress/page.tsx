"use client";

import { BarChart3 } from "lucide-react";

export default function ProgressPage() {
  return (
    <div className="px-6 py-8 max-w-md mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <BarChart3 className="text-[#F5A524]" size={48} />
      <h1 className="text-xl font-bold text-[#FAFAFA]">Progress & Stats</h1>
      <p className="text-[#71717A]">Detailed analytics, weak area analysis, and performance trends coming soon.</p>
    </div>
  );
}
