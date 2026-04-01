export const STORAGE_KEYS = {
  STORE: "mamma-store",
  PREGNANCY: "mamma-pregnancy",
  COMMUNITY: "mamma-community",
  COMMENTS: "mamma-comments",
  REPORTS: "mamma-reports",
  THEME: "mamma-theme",
} as const;

const ALL_KEYS = Object.values(STORAGE_KEYS);

export function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export interface ExportData {
  version: number;
  exportedAt: string;
  data: Record<string, unknown>;
}

export function exportAllData(): ExportData {
  const data: Record<string, unknown> = {};
  for (const key of ALL_KEYS) {
    const raw = safeGetItem(key);
    if (raw) {
      try {
        data[key] = JSON.parse(raw);
      } catch {
        data[key] = raw;
      }
    }
  }
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    data,
  };
}

export function importAllData(exported: ExportData): {
  success: boolean;
  error?: string;
} {
  if (!exported?.data || exported.version !== 1) {
    return { success: false, error: "올바르지 않은 백업 파일입니다." };
  }

  try {
    for (const [key, value] of Object.entries(exported.data)) {
      if (!ALL_KEYS.includes(key as (typeof ALL_KEYS)[number])) continue;
      const str = typeof value === "string" ? value : JSON.stringify(value);
      const ok = safeSetItem(key, str);
      if (!ok) return { success: false, error: "저장 공간이 부족합니다." };
    }
    return { success: true };
  } catch {
    return { success: false, error: "데이터 복원 중 오류가 발생했습니다." };
  }
}

export function clearAllData(): void {
  for (const key of ALL_KEYS) {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }
}

export function getStorageUsage(): { used: string; keys: number } {
  let totalBytes = 0;
  let keyCount = 0;
  for (const key of ALL_KEYS) {
    const val = safeGetItem(key);
    if (val) {
      totalBytes += key.length + val.length;
      keyCount++;
    }
  }
  const usedKB = (totalBytes * 2) / 1024;
  return {
    used: usedKB < 1024 ? `${usedKB.toFixed(1)}KB` : `${(usedKB / 1024).toFixed(2)}MB`,
    keys: keyCount,
  };
}
