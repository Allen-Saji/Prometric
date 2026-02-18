"use client";

import { useEffect, useState } from "react";
import { Heart } from "@phosphor-icons/react";
import { getHearts, getTimeUntilNextHeart, MAX_HEARTS } from "@/lib/hearts";

export function HeartsDisplay() {
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const update = () => {
      const { hearts: h } = getHearts();
      setHearts(h);
      setTimeLeft(getTimeUntilNextHeart());
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: MAX_HEARTS }).map((_, i) => (
        <Heart
          key={i}
          size={20}
          weight={i < hearts ? "fill" : "regular"}
          className={i < hearts ? "text-rose-500" : "text-muted-foreground/30"}
        />
      ))}
      {hearts < MAX_HEARTS && timeLeft > 0 && (
        <span className="text-[10px] text-muted-foreground ml-1">
          {formatTime(timeLeft)}
        </span>
      )}
    </div>
  );
}
