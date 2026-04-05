// ─── PWA 알림 시스템 ─────────────────────────────────────
// 영양제 복용 알림, 주차별 가이드 알림 등을 스케줄링합니다.
// Service Worker의 showNotification API 사용.

const STORAGE_KEY = "mamma-notification-settings";

export interface NotificationSettings {
  enabled: boolean;
  supplementReminder: boolean;
  supplementTime: string; // "HH:MM" 형식
  weeklyGuideReminder: boolean;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: false,
  supplementReminder: true,
  supplementTime: "09:00",
  weeklyGuideReminder: true,
};

export function getNotificationSettings(): NotificationSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveNotificationSettings(settings: NotificationSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  if (settings.enabled && settings.supplementReminder) {
    scheduleSupplementReminder(settings.supplementTime);
  } else {
    cancelAllReminders();
  }
}

/** 브라우저 알림 권한 요청 */
export async function requestPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;

  const result = await Notification.requestPermission();
  return result === "granted";
}

/** 알림 권한 상태 확인 */
export function getPermissionStatus(): "granted" | "denied" | "default" | "unsupported" {
  if (!("Notification" in window)) return "unsupported";
  return Notification.permission;
}

/** 즉시 알림 전송 (테스트용) */
export async function sendTestNotification() {
  const granted = await requestPermission();
  if (!granted) return false;

  const reg = await navigator.serviceWorker?.ready;
  if (reg) {
    await reg.showNotification("맘마 알림 테스트", {
      body: "알림이 정상적으로 설정되었어요! 💊",
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      tag: "test",
    });
    return true;
  }
  return false;
}

// ─── 영양제 알림 스케줄링 ────────────────────────────────

let reminderTimer: ReturnType<typeof setTimeout> | null = null;

export function scheduleSupplementReminder(time: string) {
  cancelAllReminders();

  const [hours, minutes] = time.split(":").map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(hours, minutes, 0, 0);

  // 이미 지났으면 다음날
  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }

  const delay = target.getTime() - now.getTime();

  reminderTimer = setTimeout(async () => {
    await showSupplementNotification();
    // 다음날 같은 시간에 다시 스케줄
    scheduleSupplementReminder(time);
  }, delay);
}

async function showSupplementNotification() {
  const permission = getPermissionStatus();
  if (permission !== "granted") return;

  // 오늘 이미 체크했는지 확인
  try {
    const store = localStorage.getItem("mamma-store");
    if (store) {
      const parsed = JSON.parse(store);
      const state = parsed?.state;
      const today = new Date().toISOString().slice(0, 10);
      const todayChecks = state?.supplementChecks?.[today] ?? [];
      if (todayChecks.length > 0) return; // 이미 복용 체크했으면 알림 안 보냄
    }
  } catch { /* ignore */ }

  const reg = await navigator.serviceWorker?.ready;
  if (reg) {
    await reg.showNotification("💊 영양제 드셨나요?", {
      body: "오늘의 필수 영양제를 아직 복용하지 않았어요. 탭하여 체크하세요!",
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      tag: "supplement-reminder",
      data: { url: "/supplements" },
    } as NotificationOptions);
  }
}

// ─── 혜택 알림 스케줄링 ──────────────────────────────────

let benefitTimer: ReturnType<typeof setTimeout> | null = null;

export function scheduleBenefitReminder() {
  cancelBenefitReminder();

  // 매일 오전 10시에 혜택 알림 체크
  const now = new Date();
  const target = new Date();
  target.setHours(10, 0, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);

  const delay = target.getTime() - now.getTime();

  benefitTimer = setTimeout(async () => {
    await showBenefitNotification();
    scheduleBenefitReminder();
  }, delay);
}

async function showBenefitNotification() {
  const permission = getPermissionStatus();
  if (permission !== "granted") return;

  try {
    const store = localStorage.getItem("mamma-store");
    const pregnancy = localStorage.getItem("mamma-pregnancy");
    if (!store || !pregnancy) return;

    const storeData = JSON.parse(store);
    const pregData = JSON.parse(pregnancy);
    const checkedItems: string[] = storeData?.state?.benefitChecked ?? [];

    // 현재 주차 계산
    let currentWeek = 16;
    if (pregData.dueDate) {
      const due = new Date(pregData.dueDate);
      const now = new Date();
      const daysUntil = Math.ceil((due.getTime() - now.getTime()) / 86400000);
      currentWeek = Math.max(0, Math.min(40, Math.floor((280 - daysUntil) / 7)));
    } else if (pregData.manualWeek) {
      currentWeek = pregData.manualWeek;
    }

    // 이번 주 신청해야 하는데 아직 안 한 혜택 찾기
    const { getBenefitsForWeek, getUrgentBenefits } = await import("@/data/benefits");
    const urgent = getUrgentBenefits(currentWeek).filter((b) => !checkedItems.includes(b.id));
    const available = getBenefitsForWeek(currentWeek).filter((b) => !checkedItems.includes(b.id));

    if (urgent.length > 0) {
      const item = urgent[0];
      const remainWeeks = item.deadlineWeek - currentWeek;
      const reg = await navigator.serviceWorker?.ready;
      if (reg) {
        await reg.showNotification("⚡ 마감 임박 혜택!", {
          body: `${item.name}${item.amount ? ` (${item.amount})` : ""} — ${remainWeeks}주 후 마감! 지금 신청하세요.`,
          icon: "/icon-192.png",
          badge: "/icon-192.png",
          tag: "benefit-urgent",
          data: { url: "/benefits" },
        } as NotificationOptions);
      }
    } else if (available.length > 0) {
      const item = available[0];
      const reg = await navigator.serviceWorker?.ready;
      if (reg) {
        await reg.showNotification("🎁 이번 주 신청 가능한 혜택", {
          body: `${item.name}${item.amount ? ` (${item.amount})` : ""} — ${available.length}건의 혜택이 대기 중이에요.`,
          icon: "/icon-192.png",
          badge: "/icon-192.png",
          tag: "benefit-reminder",
          data: { url: "/benefits" },
        } as NotificationOptions);
      }
    }
  } catch { /* ignore */ }
}

function cancelBenefitReminder() {
  if (benefitTimer) {
    clearTimeout(benefitTimer);
    benefitTimer = null;
  }
}

export function cancelAllReminders() {
  if (reminderTimer) {
    clearTimeout(reminderTimer);
    reminderTimer = null;
  }
  cancelBenefitReminder();
}
