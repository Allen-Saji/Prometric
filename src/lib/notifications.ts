export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export function scheduleCooldownNotification(endsAt: number): void {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  const delay = endsAt - Date.now();
  if (delay <= 0) return;

  setTimeout(() => {
    try {
      new Notification("Cooldown Over!", {
        body: "Your test cooldown has ended. Ready to try again?",
        icon: "/icon-192x192.png",
      });
    } catch {
      // Notification may fail in some contexts
    }
  }, delay);
}

export function showInAppToast(message: string): void {
  // Simple in-app notification fallback
  if (typeof window === "undefined") return;
  const existing = document.getElementById("app-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "app-toast";
  toast.className = "fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-amber-500 text-white px-6 py-3 rounded-xl shadow-lg font-medium text-sm animate-fade-up";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}
