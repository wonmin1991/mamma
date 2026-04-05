// ─── 리워드 광고 프로바이더 ─────────────────────────────
// 광고 SDK 연동을 위한 추상화 레이어.
// 현재는 시뮬레이션 모드로 동작하며, 실제 SDK 연동 시 이 파일만 수정하면 됩니다.
//
// 지원 예정 SDK:
// - Google AdMob (앱 전환 시)
// - Google AdSense (웹 PWA용)
// - Kakao Adfit
// - Naver AD (네이버 광고)

type AdState = "idle" | "loading" | "showing" | "completed" | "error";

interface AdResult {
  success: boolean;
  reward: number;
  adNetwork: string;
}

type AdCallback = (result: AdResult) => void;

const AD_CONFIG = {
  // 실제 SDK 연동 시 여기에 광고 단위 ID를 설정합니다
  rewardAdUnitId: process.env.NEXT_PUBLIC_REWARD_AD_UNIT_ID ?? "",
  bannerAdUnitId: process.env.NEXT_PUBLIC_BANNER_AD_UNIT_ID ?? "",
  // 시뮬레이션 모드 (SDK 미연동 시 자동 활성화)
  simulationMode: !process.env.NEXT_PUBLIC_REWARD_AD_UNIT_ID,
  // 시뮬레이션 광고 시청 시간 (초)
  simulationDuration: 5,
  // 리워드 하트 수
  rewardAmount: 10,
};

// ─── 리워드 광고 표시 ─────────────────────────────────────

let currentState: AdState = "idle";

export function getAdState(): AdState {
  return currentState;
}

export function isAdReady(): boolean {
  return currentState === "idle";
}

export function getAdConfig() {
  return {
    isSimulation: AD_CONFIG.simulationMode,
    rewardAmount: AD_CONFIG.rewardAmount,
    duration: AD_CONFIG.simulationDuration,
  };
}

/**
 * 리워드 광고를 표시합니다.
 * 시뮬레이션 모드에서는 타이머 기반으로 동작합니다.
 * 실제 SDK 연동 시 showRealRewardAd()를 구현하세요.
 */
export function showRewardAd(
  onProgress: (secondsLeft: number) => void,
  onComplete: AdCallback
): () => void {
  if (currentState !== "idle") {
    onComplete({ success: false, reward: 0, adNetwork: "none" });
    return () => {};
  }

  if (AD_CONFIG.simulationMode) {
    return showSimulatedAd(onProgress, onComplete);
  }

  // TODO: 실제 SDK 연동
  // return showGoogleRewardAd(onProgress, onComplete);
  // return showKakaoAdfitRewardAd(onProgress, onComplete);
  return showSimulatedAd(onProgress, onComplete);
}

// ─── 시뮬레이션 광고 ──────────────────────────────────────

function showSimulatedAd(
  onProgress: (secondsLeft: number) => void,
  onComplete: AdCallback
): () => void {
  currentState = "showing";
  let remaining = AD_CONFIG.simulationDuration;
  onProgress(remaining);

  const interval = setInterval(() => {
    remaining -= 1;
    onProgress(remaining);

    if (remaining <= 0) {
      clearInterval(interval);
      currentState = "idle";
      onComplete({
        success: true,
        reward: AD_CONFIG.rewardAmount,
        adNetwork: "simulation",
      });
    }
  }, 1000);

  // cleanup 함수 반환
  return () => {
    clearInterval(interval);
    currentState = "idle";
  };
}

// ─── 광고 시청 통계 ───────────────────────────────────────

interface AdEvent {
  timestamp: string;
  network: string;
  reward: number;
  success: boolean;
}

const AD_STATS_KEY = "mamma-ad-stats";

export function logAdEvent(result: AdResult) {
  try {
    const raw = localStorage.getItem(AD_STATS_KEY);
    const events: AdEvent[] = raw ? JSON.parse(raw) : [];

    events.push({
      timestamp: new Date().toISOString(),
      network: result.adNetwork,
      reward: result.reward,
      success: result.success,
    });

    // 최근 200건만 유지
    localStorage.setItem(AD_STATS_KEY, JSON.stringify(events.slice(-200)));
  } catch {
    // 무시
  }
}

export function getAdStats(): { totalWatched: number; totalReward: number; todayCount: number } {
  try {
    const raw = localStorage.getItem(AD_STATS_KEY);
    const events: AdEvent[] = raw ? JSON.parse(raw) : [];
    const today = new Date().toISOString().slice(0, 10);

    return {
      totalWatched: events.filter((e) => e.success).length,
      totalReward: events.filter((e) => e.success).reduce((sum, e) => sum + e.reward, 0),
      todayCount: events.filter((e) => e.success && e.timestamp.startsWith(today)).length,
    };
  } catch {
    return { totalWatched: 0, totalReward: 0, todayCount: 0 };
  }
}
