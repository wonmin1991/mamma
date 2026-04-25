import { safeGetItem, safeSetItem } from "@/lib/storage";

const KEY = "mamma-kick-counter";

export interface KickSession {
  id: string;
  startedAt: string; // ISO
  endedAt?: string;
  count: number;
  /** 10회 도달까지 걸린 분 (완료 시) */
  durationMin?: number;
}

interface Store {
  sessions: KickSession[];
  active: KickSession | null;
}

function read(): Store {
  try {
    const raw = safeGetItem(KEY);
    if (!raw) return { sessions: [], active: null };
    return JSON.parse(raw) as Store;
  } catch {
    return { sessions: [], active: null };
  }
}

function write(s: Store) {
  safeSetItem(KEY, JSON.stringify(s));
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function getStore(): Store {
  return read();
}

export function startSession(): KickSession {
  const store = read();
  const session: KickSession = {
    id: uid(),
    startedAt: new Date().toISOString(),
    count: 0,
  };
  write({ sessions: store.sessions, active: session });
  return session;
}

export function recordKick(): KickSession | null {
  const store = read();
  if (!store.active) return null;
  const updated: KickSession = { ...store.active, count: store.active.count + 1 };
  if (updated.count >= 10 && !updated.endedAt) {
    const start = new Date(updated.startedAt).getTime();
    updated.endedAt = new Date().toISOString();
    updated.durationMin = Math.round((Date.now() - start) / 60000);
    write({ sessions: [updated, ...store.sessions], active: null });
    return updated;
  }
  write({ sessions: store.sessions, active: updated });
  return updated;
}

export function cancelSession() {
  const store = read();
  write({ sessions: store.sessions, active: null });
}

export function endSessionEarly(): KickSession | null {
  const store = read();
  if (!store.active) return null;
  const start = new Date(store.active.startedAt).getTime();
  const finished: KickSession = {
    ...store.active,
    endedAt: new Date().toISOString(),
    durationMin: Math.round((Date.now() - start) / 60000),
  };
  write({ sessions: [finished, ...store.sessions], active: null });
  return finished;
}

export function getRecentSessions(days = 7): KickSession[] {
  const cutoff = Date.now() - days * 86400000;
  return read().sessions.filter((s) => new Date(s.startedAt).getTime() >= cutoff);
}
