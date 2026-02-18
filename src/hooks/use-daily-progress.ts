"use client";

import { useState, useEffect } from "react";
import { DailyProgress } from "@/lib/types";
import { getDailyProgress } from "@/lib/firestore";

export function useDailyProgress() {
  const [progress, setProgress] = useState<DailyProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const p = getDailyProgress();
    setProgress(p);
    setLoading(false);
  }, []);

  const refresh = () => {
    const p = getDailyProgress();
    setProgress(p);
  };

  return { progress, loading, refresh };
}
