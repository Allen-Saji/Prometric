"use client";

import { BookOpen } from "lucide-react";

export default function PracticePage() {
  return (
    <div className="px-6 py-8 max-w-md mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <BookOpen className="text-[#F5A524]" size={48} />
      <h1 className="text-xl font-bold text-[#FAFAFA]">Practice Mode</h1>
      <p className="text-[#71717A]">Unlimited practice questions coming soon. Complete your daily challenge first!</p>
    </div>
  );
}
