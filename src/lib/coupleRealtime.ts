// 부부 실시간 동기화 — Supabase Realtime broadcast 채널 사용 (DB 스키마 불필요).
// 같은 couple code를 공유한 두 기기가 같은 채널에 join하면, 메시지·체크리스트·태동 이벤트가 실시간 전달됩니다.

import type { RealtimeChannel } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase";

export type CoupleEvent =
  | { type: "message"; text: string; emoji?: string; sender: "mom" | "dad"; ts: string }
  | { type: "checkitem"; itemId: string; checked: boolean; sender: "mom" | "dad"; ts: string }
  | { type: "kick"; count: number; sender: "mom" | "dad"; ts: string }
  | { type: "presence"; sender: "mom" | "dad"; online: boolean };

type Listener = (event: CoupleEvent) => void;

let channel: RealtimeChannel | null = null;
let currentCode: string | null = null;
const listeners = new Set<Listener>();

function channelName(code: string) {
  return `couple-${code.toLowerCase()}`;
}

export function joinCoupleChannel(code: string, role: "mom" | "dad"): boolean {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return false;
  if (currentCode === code && channel) return true;

  leaveCoupleChannel();
  currentCode = code;

  const supabase = createClient();
  channel = supabase.channel(channelName(code), {
    config: { broadcast: { self: false }, presence: { key: role } },
  });

  channel.on("broadcast", { event: "couple-event" }, ({ payload }) => {
    listeners.forEach((l) => l(payload as CoupleEvent));
  });

  channel.subscribe((status) => {
    if (status === "SUBSCRIBED") {
      channel?.track({ role, online_at: new Date().toISOString() });
      listeners.forEach((l) => l({ type: "presence", sender: role, online: true }));
    }
  });

  return true;
}

export function leaveCoupleChannel() {
  if (channel) {
    channel.unsubscribe();
    channel = null;
  }
  currentCode = null;
}

export function broadcastCoupleEvent(event: CoupleEvent): boolean {
  if (!channel) return false;
  channel.send({ type: "broadcast", event: "couple-event", payload: event });
  return true;
}

export function onCoupleEvent(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function isCoupleConnected(): boolean {
  return channel !== null;
}
