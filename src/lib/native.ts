// ─── 네이티브 플랫폼 감지 및 플러그인 초기화 ─────────────

import { Capacitor } from "@capacitor/core";

/** 네이티브 앱 환경인지 확인 */
export function isNative(): boolean {
  return Capacitor.isNativePlatform();
}

/** 현재 플랫폼 반환 */
export function getPlatform(): "ios" | "android" | "web" {
  return Capacitor.getPlatform() as "ios" | "android" | "web";
}

/** 네이티브 플러그인 초기화 (앱 시작 시 1회 호출) */
export async function initNativePlugins() {
  if (!isNative()) return;

  const platform = getPlatform();

  // StatusBar 설정
  try {
    const { StatusBar, Style } = await import("@capacitor/status-bar");
    await StatusBar.setStyle({ style: Style.Light });
    if (platform === "android") {
      await StatusBar.setBackgroundColor({ color: "#FFF9F5" });
    }
  } catch {
    // 플러그인 미설치 시 무시
  }

  // SplashScreen 숨기기
  try {
    const { SplashScreen } = await import("@capacitor/splash-screen");
    await SplashScreen.hide();
  } catch {
    // 플러그인 미설치 시 무시
  }

  // 앱 뒤로가기 (Android)
  if (platform === "android") {
    try {
      const { App } = await import("@capacitor/app");
      App.addListener("backButton", ({ canGoBack }) => {
        if (canGoBack) {
          window.history.back();
        } else {
          App.exitApp();
        }
      });
    } catch {
      // 플러그인 미설치 시 무시
    }
  }
}
