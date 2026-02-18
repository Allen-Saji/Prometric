"use client";

interface StreakCounterProps {
  streak: number;
}

export function StreakCounter({ streak }: StreakCounterProps) {
  const fireSize = streak >= 30 ? "text-5xl" : streak >= 14 ? "text-4xl" : streak >= 7 ? "text-3xl" : "text-2xl";

  return (
    <div className="flex items-center gap-2">
      <span className={`${fireSize} animate-pulse`}>🔥</span>
      <div>
        <p className="text-3xl font-bold text-[#FAFAFA]">{streak}</p>
        <p className="text-sm text-[#71717A]">day streak</p>
      </div>
    </div>
  );
}
