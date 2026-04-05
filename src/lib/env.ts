// ─── Environment Configuration ──────────────────────────
// All external service settings are centralized here.
// Configure via .env.local or environment variables.

export const env = {
  // Naver API (for restaurant/tip crawling)
  naverClientId: process.env.NAVER_CLIENT_ID ?? "",
  naverClientSecret: process.env.NAVER_CLIENT_SECRET ?? "",

  // 공공데이터포털 API (임산부/육아 혜택 조회)
  dataGoKrServiceKey: process.env.DATA_GO_KR_SERVICE_KEY ?? "",

  // Base URL
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? "https://mamma.app",

  // Geolocation (toggle browser geolocation for restaurant sorting)
  enableGeolocation: process.env.NEXT_PUBLIC_ENABLE_GEOLOCATION !== "false",

  // Auto-backup interval in days (0 = disabled)
  autoBackupIntervalDays: Number(process.env.NEXT_PUBLIC_AUTO_BACKUP_DAYS ?? "7"),

  // Cloud sync (future: Firebase/Supabase)
  cloudSyncEnabled: process.env.NEXT_PUBLIC_CLOUD_SYNC === "true",
  cloudSyncEndpoint: process.env.NEXT_PUBLIC_CLOUD_SYNC_ENDPOINT ?? "",

  // Push notifications (future)
  pushNotificationsEnabled: process.env.NEXT_PUBLIC_PUSH_ENABLED === "true",
  vapidPublicKey: process.env.NEXT_PUBLIC_VAPID_KEY ?? "",
} as const;

export type Env = typeof env;
