// ─── 클라우드 동기화 (프리미엄 기능) ─────────────────────
// 로컬 데이터를 클라우드에 백업/복원하는 기능.
// 현재는 인터페이스만 정의하고, 실제 백엔드 연동 시 구현체를 교체합니다.
//
// 지원 예정 백엔드:
// - Firebase Firestore (권장: 무료 티어 충분)
// - Supabase
// - 자체 API 서버

import { exportAllData, importAllData, type ExportData } from "@/lib/storage";

// ─── Types ───────────────────────────────────────────────

export type SyncStatus = "idle" | "syncing" | "success" | "error" | "offline";

export interface SyncResult {
  success: boolean;
  error?: string;
  timestamp?: string;
  dataSize?: number;
}

export interface CloudSyncProvider {
  /** 클라우드에 데이터 업로드 */
  upload(userId: string, data: ExportData): Promise<SyncResult>;
  /** 클라우드에서 데이터 다운로드 */
  download(userId: string): Promise<{ data: ExportData | null } & SyncResult>;
  /** 마지막 동기화 시간 조회 */
  getLastSync(userId: string): Promise<string | null>;
}

// ─── 로컬 백업 프로바이더 (기본값) ──────────────────────────

const LOCAL_SYNC_KEY = "mamma-cloud-sync-meta";

interface SyncMeta {
  lastSync: string;
  lastBackupSize: number;
  syncCount: number;
  userId: string;
}

function getSyncMeta(): SyncMeta | null {
  try {
    const raw = localStorage.getItem(LOCAL_SYNC_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSyncMeta(meta: SyncMeta) {
  localStorage.setItem(LOCAL_SYNC_KEY, JSON.stringify(meta));
}

// ─── 동기화 코드 생성 ────────────────────────────────────

/** 6자리 동기화 코드를 생성합니다. 기기 간 연결에 사용. */
export function generateSyncCode(): string {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(36))
    .join("")
    .substring(0, 6)
    .toUpperCase();
}

/** 사용자의 동기화 ID를 가져오거나 새로 생성합니다. */
export function getOrCreateSyncId(): string {
  const SYNC_ID_KEY = "mamma-sync-id";
  let id = localStorage.getItem(SYNC_ID_KEY);
  if (!id) {
    id = `user_${Date.now()}_${generateSyncCode()}`;
    localStorage.setItem(SYNC_ID_KEY, id);
  }
  return id;
}

// ─── 데이터 내보내기/가져오기 래퍼 ──────────────────────────

/** 현재 앱 데이터를 동기화용으로 직렬화합니다. */
export function prepareForSync(): ExportData {
  return exportAllData();
}

/** 동기화된 데이터를 앱에 복원합니다. */
export function restoreFromSync(data: ExportData): SyncResult {
  const result = importAllData(data);
  if (result.success) {
    return { success: true, timestamp: new Date().toISOString() };
  }
  return { success: false, error: result.error };
}

// ─── 수동 동기화 (QR 코드 / 코드 입력 방식) ────────────────

/** 데이터를 base64로 인코딩하여 공유 가능한 문자열로 변환합니다. */
export function exportToShareableString(): string {
  const data = exportAllData();
  const json = JSON.stringify(data);
  // base64 인코딩
  return btoa(unescape(encodeURIComponent(json)));
}

/** 공유받은 문자열에서 데이터를 복원합니다. */
export function importFromShareableString(encoded: string): SyncResult {
  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    const data = JSON.parse(json) as ExportData;

    if (!data || typeof data !== "object" || !data.data || typeof data.version !== "number") {
      return { success: false, error: "올바르지 않은 동기화 데이터입니다" };
    }

    return restoreFromSync(data);
  } catch {
    return { success: false, error: "동기화 데이터를 읽을 수 없습니다" };
  }
}

// ─── Firebase 연동 준비 (TODO) ───────────────────────────

/*
Firebase 연동 시 구현할 내용:

1. firebase.ts 파일 생성:
   - initializeApp() with config from env
   - getFirestore() instance export

2. FirebaseSyncProvider 구현:
   upload: setDoc(doc(db, "users", userId), { data, updatedAt })
   download: getDoc(doc(db, "users", userId))
   getLastSync: getDoc → updatedAt field

3. 설정 페이지에 동기화 UI 추가:
   - 동기화 활성화 토글
   - 마지막 동기화 시간 표시
   - 수동 동기화 버튼
   - 동기화 코드 표시/입력

4. .env.example에 Firebase config 추가:
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=

5. package.json에 firebase 의존성 추가:
   npm install firebase
*/

// ─── 동기화 상태 관리 (설정 페이지용) ─────────────────────

export function getSyncInfo(): {
  isEnabled: boolean;
  lastSync: string | null;
  syncId: string | null;
  syncCount: number;
} {
  const meta = getSyncMeta();
  return {
    isEnabled: !!meta,
    lastSync: meta?.lastSync ?? null,
    syncId: meta?.userId ?? null,
    syncCount: meta?.syncCount ?? 0,
  };
}

export function recordSync(userId: string, dataSize: number) {
  const prev = getSyncMeta();
  saveSyncMeta({
    lastSync: new Date().toISOString(),
    lastBackupSize: dataSize,
    syncCount: (prev?.syncCount ?? 0) + 1,
    userId,
  });
}
