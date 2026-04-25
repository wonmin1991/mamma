import { env } from "@/lib/env";

const KEY = "mamma-chat-usage";

interface Usage {
  date: string;
  count: number;
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function read(): Usage {
  if (typeof window === "undefined") return { date: todayStr(), count: 0 };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { date: todayStr(), count: 0 };
    const parsed = JSON.parse(raw) as Usage;
    if (parsed.date !== todayStr()) return { date: todayStr(), count: 0 };
    return parsed;
  } catch {
    return { date: todayStr(), count: 0 };
  }
}

export function getRemainingChats(): number {
  const limit = env.chatDailyLimit;
  if (limit <= 0) return Number.POSITIVE_INFINITY;
  return Math.max(0, limit - read().count);
}

export function consumeChat(): boolean {
  const limit = env.chatDailyLimit;
  if (limit <= 0) return true;
  const usage = read();
  if (usage.count >= limit) return false;
  const next: Usage = { date: todayStr(), count: usage.count + 1 };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch { /* ignore */ }
  return true;
}
