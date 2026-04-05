// ─── 어필리에이트 링크 트래킹 ─────────────────────────────
// 외부 링크에 UTM 파라미터와 어필리에이트 ID를 자동 부착합니다.
// .env.local에서 NEXT_PUBLIC_AFFILIATE_ID를 설정하세요.

const AFFILIATE_ID = process.env.NEXT_PUBLIC_AFFILIATE_ID ?? "mamma";

type LinkSource =
  | "benefit"     // 정부 혜택 신청
  | "package"     // 육아 패키지/웰컴키트
  | "tip"         // 꿀팁 원문
  | "restaurant"  // 맛집 외부 링크
  | "community";  // 커뮤니티 외부 링크

/**
 * 외부 URL에 어필리에이트 트래킹 파라미터를 추가합니다.
 * - UTM 파라미터: 유입 경로 분석용
 * - 어필리에이트 ID: 제휴 커미션 추적용
 */
export function trackLink(url: string, source: LinkSource, itemName?: string): string {
  if (!url) return url;

  try {
    const u = new URL(url);

    // UTM 파라미터
    u.searchParams.set("utm_source", "mamma_app");
    u.searchParams.set("utm_medium", source);
    if (itemName) {
      u.searchParams.set("utm_campaign", itemName.slice(0, 50));
    }

    // 주요 제휴 플랫폼별 어필리에이트 파라미터
    const host = u.hostname;

    if (host.includes("coupang.com")) {
      u.searchParams.set("src", AFFILIATE_ID);
      u.searchParams.set("subid", source);
    } else if (host.includes("naver.com") || host.includes("shopping.naver")) {
      u.searchParams.set("nv_mid", AFFILIATE_ID);
    }

    return u.toString();
  } catch {
    // URL이 유효하지 않으면 원본 반환
    return url;
  }
}

// ─── 클릭 이벤트 로깅 ────────────────────────────────────

interface ClickEvent {
  source: LinkSource;
  url: string;
  itemName: string;
  timestamp: string;
}

const STORAGE_KEY = "mamma-affiliate-clicks";
const MAX_EVENTS = 500;

/** 어필리에이트 클릭 이벤트를 로컬에 기록합니다. */
export function logClick(source: LinkSource, url: string, itemName: string) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const events: ClickEvent[] = raw ? JSON.parse(raw) : [];

    events.push({
      source,
      url,
      itemName,
      timestamp: new Date().toISOString(),
    });

    // 최대 500건만 유지
    const trimmed = events.slice(-MAX_EVENTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // 저장 실패 무시
  }
}

/** 저장된 클릭 이벤트를 조회합니다 (분석용). */
export function getClickEvents(): ClickEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** 소스별 클릭 통계를 반환합니다. */
export function getClickStats(): Record<LinkSource, number> {
  const events = getClickEvents();
  const stats: Record<string, number> = {};
  for (const e of events) {
    stats[e.source] = (stats[e.source] ?? 0) + 1;
  }
  return stats as Record<LinkSource, number>;
}
