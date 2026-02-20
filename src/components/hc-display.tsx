"use client";

import { CurrencyCircleDollar } from "@phosphor-icons/react";
import { getHC } from "@/lib/hero-credits";
import { useEffect, useState } from "react";

export function HCDisplay() {
  const [hc, setHC] = useState(0);

  useEffect(() => {
    setHC(getHC());
  }, []);

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
      <CurrencyCircleDollar size={16} weight="fill" className="text-amber-500" />
      <span className="text-xs font-heading font-bold text-amber-500">{hc}</span>
    </div>
  );
}
