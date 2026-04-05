"use client";

import { useEffect } from "react";
import { initNativePlugins, isNative } from "@/lib/native";
import { getNotificationSettings, scheduleSupplementReminder, scheduleBenefitReminder } from "@/lib/notifications";

export default function NativeInit() {
  useEffect(() => {
    initNativePlugins();

    // 네이티브 앱에서 safe area 적용
    if (isNative()) {
      document.documentElement.classList.add("native-app");
    }

    // 알림 스케줄링 자동 시작
    const notiSettings = getNotificationSettings();
    if (notiSettings.enabled) {
      if (notiSettings.supplementReminder) {
        scheduleSupplementReminder(notiSettings.supplementTime);
      }
      scheduleBenefitReminder();
    }
  }, []);

  return null;
}
