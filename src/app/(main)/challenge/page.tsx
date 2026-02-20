"use client";

import { useSearchParams } from "next/navigation";
import { DailyChallenge } from "@/components/daily-challenge";
import { Suspense } from "react";

function ChallengeContent() {
  const searchParams = useSearchParams();
  const dayParam = searchParams.get("day");
  const dayNumber = dayParam ? parseInt(dayParam, 10) : undefined;

  return <DailyChallenge dayNumber={dayNumber} />;
}

export default function ChallengePage() {
  return (
    <div className="px-6 py-8 max-w-md mx-auto">
      <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><div className="text-muted-foreground font-medium">Loading...</div></div>}>
        <ChallengeContent />
      </Suspense>
    </div>
  );
}
