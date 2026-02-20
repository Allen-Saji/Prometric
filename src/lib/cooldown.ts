import { CooldownState } from "./types";

const COOLDOWN_PREFIX = "cooldown-";

function getCooldownKey(dayNumber: number): string {
  return `${COOLDOWN_PREFIX}${dayNumber}`;
}

export function getCooldownState(dayNumber: number): CooldownState | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(getCooldownKey(dayNumber));
  if (!data) return null;
  const state: CooldownState = JSON.parse(data);
  if (Date.now() >= state.lockedUntil) {
    localStorage.removeItem(getCooldownKey(dayNumber));
    return null;
  }
  return state;
}

export function isOnCooldown(dayNumber: number): boolean {
  const state = getCooldownState(dayNumber);
  return state !== null;
}

export function getRemainingCooldown(dayNumber: number): number {
  const state = getCooldownState(dayNumber);
  if (!state) return 0;
  return Math.max(0, state.lockedUntil - Date.now());
}

export function startCooldown(dayNumber: number, attempts: number): CooldownState {
  let durationMs: number;

  if (attempts >= 3) {
    // 3+ attempts: 3 hour lockout
    durationMs = 3 * 60 * 60 * 1000;
  } else {
    // Attempts 1-2: random 30-60 min
    durationMs = (30 + Math.floor(Math.random() * 31)) * 60 * 1000;
  }

  const state: CooldownState = {
    dayNumber,
    attempts,
    lockedUntil: Date.now() + durationMs,
  };

  localStorage.setItem(getCooldownKey(dayNumber), JSON.stringify(state));
  return state;
}

export function clearCooldown(dayNumber: number): void {
  localStorage.removeItem(getCooldownKey(dayNumber));
}

export function formatCooldownTime(ms: number): string {
  if (ms <= 0) return "0:00";
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
