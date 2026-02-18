"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
        <Settings className="text-[#F5A524]" size={24} />
        <h1 className="text-xl font-bold text-[#FAFAFA]">Settings</h1>
      </div>

      <div className="space-y-3">
        <div className="bg-[#141416] border border-[#1F1F23] rounded-xl p-4">
          <p className="text-sm text-[#71717A]">More settings coming soon — notification preferences, profile editing, and payment management.</p>
        </div>

        <Button
          onClick={handleSignOut}
          variant="outline"
          className="w-full border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/10"
        >
          <LogOut className="mr-2" size={16} />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
