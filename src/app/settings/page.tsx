"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Download,
  Upload,
  Trash2,
  HardDrive,
  Calendar,
  AlertTriangle,
  Check,
  Info,
  Moon,
  Sun,
  Monitor,
  Cloud,
  Copy,
  Smartphone,
  MapPin,
  ChevronDown,
  Bell,
  BellOff,
  Settings2,
} from "lucide-react";
import {
  exportAllData,
  importAllData,
  clearAllData,
  getStorageUsage,
  STORAGE_KEYS,
  type ExportData,
} from "@/lib/storage";
import { usePregnancy } from "@/contexts/PregnancyContext";
import { useStore } from "@/store/useStore";
import { useBabyStore } from "@/store/useBabyStore";
import { exportToShareableString, importFromShareableString } from "@/lib/cloudSync";
import { regions, getDistrictsByRegion } from "@/data/regions";
import {
  getNotificationSettings,
  saveNotificationSettings,
  requestPermission,
  getPermissionStatus,
  sendTestNotification,
  type NotificationSettings,
} from "@/lib/notifications";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, LogOut, User } from "lucide-react";

export default function SettingsPage() {
  const { dueDate, currentWeek, babyNickname, parentRole, childOrder, setDueDate, setWeekDirectly, setBabyNickname, setParentRole, setChildOrder, reset } =
    usePregnancy();
  const babyMode = useBabyStore((s) => s.mode);
  const setMode = useBabyStore((s) => s.setMode);
  const isPostnatal = babyMode === "postnatal";
  const isInfertility = babyMode === "infertility";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [storageInfo, setStorageInfo] = useState({ used: "0 KB", keys: 0 });
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [savedRegion, setSavedRegion] = useState("");
  const [savedDistrict, setSavedDistrict] = useState("");
  const [notiSettings, setNotiSettings] = useState<NotificationSettings | null>(null);
  const [notiPermission, setNotiPermission] = useState<string>("default");
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  const { user, syncing, signOut, syncNow } = useAuth();

  useEffect(() => {
    try {
      setSavedRegion(localStorage.getItem("mamma-benefit-region") || "");
      setSavedDistrict(localStorage.getItem("mamma-benefit-district") || "");
    } catch { /* ignore */ }
    setNotiSettings(getNotificationSettings());
    setNotiPermission(getPermissionStatus());
    setStorageInfo(getStorageUsage());
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = useCallback(
    (message: string, type: "success" | "error") => {
      setToast({ message, type });
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => setToast(null), 3000);
    },
    []
  );

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    if (newTheme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", prefersDark);
      localStorage.removeItem(STORAGE_KEYS.THEME);
    } else {
      document.documentElement.classList.toggle("dark", newTheme === "dark");
      localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    }
    showToast("테마가 변경되었습니다", "success");
  };

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = globalThis.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mamma-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    globalThis.URL.revokeObjectURL(url);
    showToast("백업 파일이 다운로드되었습니다", "success");
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text) as ExportData;

      if (!data || typeof data !== "object" || !data.data || typeof data.version !== "number") {
        showToast("올바르지 않은 백업 파일 형식입니다", "error");
        return;
      }

      const result = importAllData(data);
      if (result.success) {
        showToast("데이터가 복원되었습니다. 새로고침합니다...", "success");
        setTimeout(() => globalThis.location.reload(), 1500);
      } else {
        showToast(result.error || "복원에 실패했습니다", "error");
      }
    } catch {
      showToast("올바르지 않은 파일입니다", "error");
    } finally {
      e.target.value = "";
    }
  };

  const handleClearAll = () => {
    clearAllData();
    reset();
    setShowClearConfirm(false);
    setStorageInfo(getStorageUsage());
    showToast("모든 데이터가 삭제되었습니다", "success");
    setTimeout(() => globalThis.location.reload(), 1500);
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDueDate(e.target.value);
    showToast("출산예정일이 변경되었습니다", "success");
  };

  const handleWeekChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setWeekDirectly(Number(e.target.value));
    showToast("임신 주차가 변경되었습니다", "success");
  };

  return (
    <main className="flex flex-col">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md px-5 pt-12 pb-3">
        <div className="flex items-center gap-2">
          <Link href="/" className="p-1 -ml-1" aria-label="뒤로가기">
            <ChevronLeft size={22} className="text-foreground" />
          </Link>
          <h1 className="text-lg font-bold text-foreground">설정</h1>
        </div>
      </header>

      <section className="px-5 pb-8 flex flex-col gap-5">
        {/* Account */}
        <div className="bg-card rounded-2xl border border-card-border shadow-sm p-5">
          <h2 className="font-bold text-sm text-foreground flex items-center gap-2 mb-4">
            <User size={16} className="text-primary" />
            계정
          </h2>
          {user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="" className="w-10 h-10 rounded-full" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
                    <User size={18} className="text-primary" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0]}
                  </p>
                  <p className="text-[11px] text-muted">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    await syncNow();
                    showToast("클라우드에 동기화했어요", "success");
                  }}
                  disabled={syncing}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-primary-light text-primary text-[11px] font-medium"
                >
                  {syncing ? "동기화 중..." : "동기화"}
                </button>
                <button
                  onClick={async () => {
                    await signOut();
                    showToast("로그아웃되었습니다", "success");
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-surface text-muted text-[11px] font-medium border border-card-border"
                >
                  <LogOut size={11} />
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-white text-sm font-medium transition-all active:scale-[0.98]"
            >
              <LogIn size={16} />
              로그인 / 회원가입
            </Link>
          )}
        </div>

        {/* Mode selection */}
        <div className="bg-card rounded-2xl border border-card-border shadow-sm p-5">
          <h2 className="font-bold text-sm text-foreground flex items-center gap-2 mb-4">
            <Settings2 size={16} className="text-primary" />
            앱 모드
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {([
              { value: "pregnancy" as const, label: "임신 중", emoji: "🤰" },
              { value: "infertility" as const, label: "난임 준비", emoji: "🌱" },
              { value: "postnatal" as const, label: "출산 후", emoji: "👶" },
            ]).map(({ value, label, emoji }) => (
              <button
                key={value}
                onClick={() => {
                  setMode(value);
                  showToast(`${label} 모드로 변경했어요`, "success");
                }}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-sm font-medium transition-all ${
                  babyMode === value
                    ? "bg-primary text-white shadow-sm"
                    : "bg-surface text-muted border border-card-border"
                }`}
              >
                <span className="text-lg">{emoji}</span>
                <span className="text-xs">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Pregnancy info */}
        {!isInfertility && (
        <div className="bg-card rounded-2xl border border-card-border shadow-sm p-5">
          <h2 className="font-bold text-sm text-foreground flex items-center gap-2 mb-4">
            <Calendar size={16} className="text-primary" />
            임신 정보
          </h2>

          <div className="flex flex-col gap-3">
            <div>
              <p className="text-xs text-muted mb-1">나는</p>
              <div className="grid grid-cols-2 gap-2">
                {(["mom", "dad"] as const).map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setParentRole(role);
                      const prefix = isPostnatal ? "" : "예비 ";
                      showToast(role === "mom" ? `${prefix}엄마로 설정했어요` : `${prefix}아빠로 설정했어요`, "success");
                    }}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                      parentRole === role
                        ? "bg-primary text-white"
                        : "bg-surface text-muted border border-card-border"
                    }`}
                  >
                    {role === "mom"
                      ? isPostnatal ? "👩‍👧 엄마" : "🤰 예비 엄마"
                      : isPostnatal ? "👨‍👧 아빠" : "👨‍👧 예비 아빠"
                    }
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-muted mb-1">몇 번째 아이</p>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    onClick={() => {
                      setChildOrder(n);
                      showToast(`${n === 1 ? "첫째" : n === 2 ? "둘째" : n === 3 ? "셋째" : "넷째+"}로 설정했어요`, "success");
                    }}
                    className={`py-2 rounded-xl text-xs font-medium transition-all ${
                      childOrder === n
                        ? "bg-primary text-white"
                        : "bg-surface text-muted border border-card-border"
                    }`}
                  >
                    {n === 1 ? "첫째" : n === 2 ? "둘째" : n === 3 ? "셋째" : "넷째+"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="baby-nickname" className="text-xs text-muted block mb-1">
                태명
              </label>
              <input
                id="baby-nickname"
                type="text"
                defaultValue={babyNickname}
                onBlur={(e) => {
                  const val = e.target.value.trim();
                  if (val && val !== babyNickname) {
                    setBabyNickname(val);
                    showToast("태명이 변경되었습니다", "success");
                  } else if (!val) {
                    e.target.value = babyNickname;
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                }}
                placeholder="예: 콩이, 복덩이"
                maxLength={10}
                className="w-full px-3 py-2.5 rounded-xl bg-surface border border-card-border text-sm text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="due-date" className="text-xs text-muted block mb-1">
                출산예정일
              </label>
              <input
                id="due-date"
                type="date"
                value={dueDate || ""}
                onChange={handleDueDateChange}
                className="w-full px-3 py-2.5 rounded-xl bg-surface border border-card-border text-sm text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="week-select" className="text-xs text-muted block mb-1">
                직접 주차 설정 (현재: {currentWeek}주)
              </label>
              <select
                id="week-select"
                value={currentWeek}
                onChange={handleWeekChange}
                className="w-full px-3 py-2.5 rounded-xl bg-surface border border-card-border text-sm text-foreground focus:outline-none focus:border-primary"
              >
                {Array.from({ length: 40 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}주
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        )}

        {/* Region */}
        <div className="bg-card rounded-2xl border border-card-border shadow-sm p-5">
          <h2 className="font-bold text-sm text-foreground flex items-center gap-2 mb-4">
            <MapPin size={16} className="text-primary" />
            거주 지역
          </h2>
          <p className="text-xs text-muted mb-3">
            지역별 출산/육아 혜택을 맞춤 제공합니다
          </p>

          <div className="flex flex-col gap-3">
            <div className="relative">
              <select
                value={savedRegion}
                onChange={(e) => {
                  const v = e.target.value;
                  setSavedRegion(v);
                  setSavedDistrict("");
                  localStorage.setItem("mamma-benefit-region", v);
                  localStorage.removeItem("mamma-benefit-district");
                  showToast("지역이 변경되었습니다", "success");
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-surface border border-card-border text-sm text-foreground focus:outline-none focus:border-primary appearance-none"
              >
                <option value="">시/도 선택</option>
                {regions.map((r) => (
                  <option key={r.code} value={r.name}>{r.name}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            </div>

            {savedRegion && getDistrictsByRegion(savedRegion).length > 1 && (
              <div className="relative">
                <select
                  value={savedDistrict}
                  onChange={(e) => {
                    const v = e.target.value;
                    setSavedDistrict(v);
                    localStorage.setItem("mamma-benefit-district", v);
                    showToast("지역이 변경되었습니다", "success");
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface border border-card-border text-sm text-foreground focus:outline-none focus:border-primary appearance-none"
                >
                  <option value="">시/군/구 선택</option>
                  {getDistrictsByRegion(savedRegion).map((d) => (
                    <option key={d.code} value={d.name}>{d.name}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              </div>
            )}
          </div>
        </div>

        {/* Theme */}
        <div className="bg-card rounded-2xl border border-card-border shadow-sm p-5">
          <h2 className="font-bold text-sm text-foreground flex items-center gap-2 mb-4">
            <Moon size={16} className="text-secondary" />
            화면 테마
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {([
              { value: "light" as const, label: "라이트", icon: Sun },
              { value: "dark" as const, label: "다크", icon: Moon },
              { value: "system" as const, label: "시스템", icon: Monitor },
            ]).map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => handleThemeChange(value)}
                className={`flex flex-col items-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
                  theme === value
                    ? "bg-primary text-white shadow-sm"
                    : "bg-surface text-muted border border-card-border"
                }`}
              >
                <Icon size={18} />
                <span className="text-xs">{label}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-muted mt-3">
            시스템 설정을 선택하면 기기의 다크모드 설정에 자동으로 맞춰집니다.
          </p>
        </div>

        {/* Notifications */}
        {notiSettings && (
          <div className="bg-card rounded-2xl border border-card-border shadow-sm p-5">
            <h2 className="font-bold text-sm text-foreground flex items-center gap-2 mb-4">
              <Bell size={16} className="text-primary" />
              알림 설정
            </h2>

            {notiPermission === "unsupported" ? (
              <p className="text-xs text-muted">이 브라우저는 알림을 지원하지 않습니다.</p>
            ) : notiPermission === "denied" ? (
              <div className="flex items-start gap-2">
                <BellOff size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted">
                  알림 권한이 차단되었습니다. 브라우저 설정에서 알림 권한을 허용해주세요.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Enable toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">알림 받기</p>
                    <p className="text-xs text-muted mt-0.5">영양제 복용 알림을 받습니다</p>
                  </div>
                  <button
                    onClick={async () => {
                      if (!notiSettings.enabled) {
                        const granted = await requestPermission();
                        if (!granted) {
                          showToast("알림 권한이 필요합니다", "error");
                          setNotiPermission(getPermissionStatus());
                          return;
                        }
                        setNotiPermission("granted");
                      }
                      const updated = { ...notiSettings, enabled: !notiSettings.enabled };
                      saveNotificationSettings(updated);
                      setNotiSettings(updated);
                      showToast(updated.enabled ? "알림이 활성화되었습니다" : "알림이 비활성화되었습니다", "success");
                    }}
                    className={`w-12 h-7 rounded-full transition-colors relative ${
                      notiSettings.enabled ? "bg-primary" : "bg-surface border border-card-border"
                    }`}
                  >
                    <span className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${
                      notiSettings.enabled ? "translate-x-5" : "translate-x-0.5"
                    }`} />
                  </button>
                </div>

                {notiSettings.enabled && (
                  <>
                    {/* Supplement time */}
                    <div>
                      <label htmlFor="noti-time" className="text-xs text-muted block mb-1">
                        영양제 알림 시간
                      </label>
                      <input
                        id="noti-time"
                        type="time"
                        value={notiSettings.supplementTime}
                        onChange={(e) => {
                          const updated = { ...notiSettings, supplementTime: e.target.value };
                          saveNotificationSettings(updated);
                          setNotiSettings(updated);
                          showToast(`알림 시간이 ${e.target.value}로 변경되었습니다`, "success");
                        }}
                        className="w-full px-3 py-2.5 rounded-xl bg-surface border border-card-border text-sm text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>

                    {/* Test button */}
                    <button
                      onClick={async () => {
                        const sent = await sendTestNotification();
                        showToast(sent ? "테스트 알림을 보냈습니다" : "알림 전송에 실패했습니다", sent ? "success" : "error");
                      }}
                      className="text-xs text-primary font-medium text-left"
                    >
                      테스트 알림 보내기
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Data management */}
        <div className="bg-card rounded-2xl border border-card-border shadow-sm p-5">
          <h2 className="font-bold text-sm text-foreground flex items-center gap-2 mb-2">
            <HardDrive size={16} className="text-secondary" />
            데이터 관리
          </h2>
          <p className="text-xs text-muted mb-4 flex items-start gap-1.5">
            <Info size={12} className="flex-shrink-0 mt-0.5" />
            모든 데이터는 이 기기의 브라우저에만 저장됩니다. 기기를 변경하거나
            브라우저 데이터를 삭제하면 사라질 수 있습니다.
          </p>

          <div className="bg-surface rounded-xl p-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">사용 중인 저장 공간</span>
              <span className="text-xs font-semibold text-foreground">
                {storageInfo.used}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-muted">저장된 항목</span>
              <span className="text-xs font-semibold text-foreground">
                {storageInfo.keys}개
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-white text-sm font-medium transition-all active:scale-[0.98]"
            >
              <Download size={16} />
              데이터 백업 (내보내기)
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-surface text-foreground text-sm font-medium border border-card-border transition-all active:scale-[0.98]"
            >
              <Upload size={16} />
              데이터 복원 (가져오기)
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </div>
        </div>

        {/* Device sync */}
        <div className="bg-card rounded-2xl border border-card-border shadow-sm p-5">
          <h2 className="font-bold text-sm text-foreground flex items-center gap-2 mb-2">
            <Cloud size={16} className="text-primary" />
            기기 간 데이터 이동
          </h2>
          <p className="text-xs text-muted mb-4 flex items-start gap-1.5">
            <Smartphone size={12} className="flex-shrink-0 mt-0.5" />
            다른 기기로 데이터를 옮길 때 사용하세요. 동기화 코드를
            복사하여 새 기기에서 붙여넣기하면 됩니다.
          </p>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                try {
                  const code = exportToShareableString();
                  navigator.clipboard.writeText(code);
                  showToast("동기화 코드가 복사되었습니다. 새 기기에서 붙여넣기하세요.", "success");
                } catch {
                  showToast("동기화 코드 생성에 실패했습니다", "error");
                }
              }}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-white text-sm font-medium transition-all active:scale-[0.98]"
            >
              <Copy size={16} />
              동기화 코드 복사 (내보내기)
            </button>

            <button
              onClick={async () => {
                try {
                  const code = await navigator.clipboard.readText();
                  if (!code || code.length < 10) {
                    showToast("클립보드에 동기화 코드가 없습니다", "error");
                    return;
                  }
                  const result = importFromShareableString(code);
                  if (result.success) {
                    showToast("데이터가 복원되었습니다. 새로고침합니다...", "success");
                    setTimeout(() => globalThis.location.reload(), 1500);
                  } else {
                    showToast(result.error || "복원에 실패했습니다", "error");
                  }
                } catch {
                  showToast("클립보드를 읽을 수 없습니다", "error");
                }
              }}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-surface text-foreground text-sm font-medium border border-card-border transition-all active:scale-[0.98]"
            >
              <Download size={16} />
              동기화 코드 붙여넣기 (가져오기)
            </button>
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-card rounded-2xl border border-red-200 dark:border-red-900/50 shadow-sm p-5">
          <h2 className="font-bold text-sm text-red-500 flex items-center gap-2 mb-3">
            <AlertTriangle size={16} />
            위험 구역
          </h2>

          {showClearConfirm ? (
            <div className="animate-fade-in-up">
              <p className="text-xs text-red-500 mb-3 font-medium">
                정말로 모든 데이터를 삭제하시겠습니까?
                <br />
                북마크, 하트, 커플 모드, 아기방 등 모든 진행 상황이 사라집니다.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl bg-surface text-foreground text-sm font-medium border border-card-border"
                >
                  취소
                </button>
                <button
                  onClick={handleClearAll}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium"
                >
                  삭제 확인
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 text-sm font-medium border border-red-200 dark:border-red-900/50 transition-all active:scale-[0.98]"
            >
              <Trash2 size={16} />
              모든 데이터 삭제
            </button>
          )}
        </div>

        {/* Feedback */}
        <Link
          href="/feedback"
          className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl border border-card-border p-5 flex items-center gap-3 active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
            <span className="text-lg">💬</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-foreground">의견 보내기</p>
            <p className="text-[11px] text-muted mt-0.5">불편한 점, 원하는 기능, 틀린 정보 제보</p>
          </div>
          <ChevronLeft size={16} className="text-muted rotate-180" />
        </Link>

        {/* App info */}
        <div className="bg-card rounded-2xl border border-card-border shadow-sm p-5 text-center">
          <p className="text-2xl mb-2">🤰</p>
          <p className="text-sm font-bold text-foreground">맘마 v0.1.0</p>
          <p className="text-xs text-muted mt-1">
            임신·난임·육아 정보를 한곳에서
          </p>
          <div className="flex gap-3 justify-center mt-3">
            <Link href="/terms" className="text-[11px] text-muted underline underline-offset-2">
              이용약관
            </Link>
            <Link href="/privacy" className="text-[11px] text-muted underline underline-offset-2">
              개인정보 처리방침
            </Link>
          </div>
        </div>
      </section>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
              toast.type === "success"
                ? "bg-emerald-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {toast.type === "success" ? (
              <Check size={16} />
            ) : (
              <AlertTriangle size={16} />
            )}
            {toast.message}
          </div>
        </div>
      )}
    </main>
  );
}
