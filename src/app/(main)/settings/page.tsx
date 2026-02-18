"use client";

import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOut } from "@/lib/auth";
import { GearSix, SignOut } from "@phosphor-icons/react";

export default function SettingsPage() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="px-6 py-8 max-w-md mx-auto space-y-6">
      <div className="flex items-center gap-3 animate-fade-up animate-fade-up-1">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
          <GearSix size={22} weight="duotone" className="text-amber-500" />
        </div>
        <h1 className="text-xl font-heading font-bold text-foreground">Settings</h1>
      </div>

      <div className="space-y-3 animate-fade-up animate-fade-up-2">
        <div className="glass-card rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-heading font-semibold text-foreground">Theme</p>
            <p className="text-xs text-muted-foreground mt-0.5">Toggle dark/light mode</p>
          </div>
          <ThemeToggle />
        </div>

        <div className="glass-card rounded-2xl p-5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            More settings coming soon — notification preferences, profile editing, and payment management.
          </p>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 glass-card rounded-2xl p-4 !border-rose-500/20 text-rose-500 font-medium text-sm hover:bg-rose-500/5 transition-all duration-200"
        >
          <SignOut size={18} weight="bold" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
