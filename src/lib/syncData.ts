import { createClient } from "@/lib/supabase";
import { STORAGE_KEYS } from "@/lib/storage";

const SYNC_KEYS = {
  pregnancy: STORAGE_KEYS.PREGNANCY,  // "mamma-pregnancy"
  store: STORAGE_KEYS.STORE,          // "mamma-store"
  baby: STORAGE_KEYS.BABY,            // "mamma-baby"
} as const;

function safeGetJson(key: string): Record<string, unknown> {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** 로그인 직후: localStorage → Supabase 업로드 */
export async function uploadLocalDataToCloud(userId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const pregnancyData = safeGetJson(SYNC_KEYS.pregnancy);
  const storeData = safeGetJson(SYNC_KEYS.store);
  const babyData = safeGetJson(SYNC_KEYS.baby);

  // 로컬에 데이터가 없으면 업로드 스킵
  const hasLocal = Object.keys(pregnancyData).length > 0 || Object.keys(storeData).length > 0 || Object.keys(babyData).length > 0;
  if (!hasLocal) return { success: true };

  const { error } = await supabase
    .from("user_data")
    .upsert({
      user_id: userId,
      pregnancy_data: pregnancyData,
      store_data: storeData,
      baby_data: babyData,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

/** 로그인 직후: Supabase → localStorage 다운로드 */
export async function downloadCloudDataToLocal(userId: string): Promise<{ success: boolean; hasCloudData: boolean; error?: string }> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_data")
    .select("pregnancy_data, store_data, baby_data, updated_at")
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return { success: true, hasCloudData: false }; // no rows
    return { success: false, hasCloudData: false, error: error.message };
  }

  if (!data) return { success: true, hasCloudData: false };

  // 클라우드 데이터가 있으면 localStorage에 적용
  const hasCloud = data.pregnancy_data && Object.keys(data.pregnancy_data).length > 0;

  if (hasCloud) {
    try {
      if (data.pregnancy_data && Object.keys(data.pregnancy_data).length > 0) {
        localStorage.setItem(SYNC_KEYS.pregnancy, JSON.stringify(data.pregnancy_data));
      }
      if (data.store_data && Object.keys(data.store_data).length > 0) {
        localStorage.setItem(SYNC_KEYS.store, JSON.stringify(data.store_data));
      }
      if (data.baby_data && Object.keys(data.baby_data).length > 0) {
        localStorage.setItem(SYNC_KEYS.baby, JSON.stringify(data.baby_data));
      }
    } catch {
      return { success: false, hasCloudData: true, error: "localStorage 저장 실패" };
    }
  }

  return { success: true, hasCloudData: !!hasCloud };
}

/** 데이터 변경 시 클라우드에 자동 저장 (디바운스 적용) */
let syncTimer: ReturnType<typeof setTimeout> | null = null;

export function scheduleSyncToCloud(userId: string) {
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    uploadLocalDataToCloud(userId);
  }, 3000); // 3초 디바운스
}
