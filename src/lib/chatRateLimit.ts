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

/** 사용 가능 여부만 체크 (카운트 변경 없음) */
export function canSendChat(): boolean {
  const limit = env.chatDailyLimit;
  if (limit <= 0) return true;
  return read().count < limit;
}

/** 실제 사용 카운트 1 증가 (API 호출 성공 후에만 호출) */
export function consumeChat(): void {
  const limit = env.chatDailyLimit;
  if (limit <= 0) return;
  const usage = read();
  const next: Usage = { date: todayStr(), count: usage.count + 1 };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch { /* ignore */ }
}
