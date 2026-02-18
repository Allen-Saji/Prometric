"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOut } from "@/lib/auth";
import { Settings, LogOut } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="px-6 py-8 max-w-md mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="text-primary" size={24} />
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
      </div>

      <div className="space-y-3">
        <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Theme</p>
            <p className="text-xs text-muted-foreground">Toggle dark/light mode</p>
          </div>
          <ThemeToggle />
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">More settings coming soon — notification preferences, profile editing, and payment management.</p>
        </div>

        <Button
          onClick={handleSignOut}
          variant="outline"
          className="w-full border-destructive/30 text-destructive hover:bg-destructive/10"
        >
          <LogOut className="mr-2" size={16} />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
