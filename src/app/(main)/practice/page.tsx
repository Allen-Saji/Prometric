"use client";

import { BookOpen } from "lucide-react";

export default function PracticePage() {
  return (
    <div className="px-6 py-8 max-w-md mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <BookOpen className="text-primary" size={48} />
      <h1 className="text-xl font-bold text-foreground">Practice Mode</h1>
      <p className="text-muted-foreground">Unlimited practice questions coming soon. Complete your daily challenge first!</p>
    </div>
  );
}
