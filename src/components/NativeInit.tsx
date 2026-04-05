"use client";

import { useEffect } from "react";
import { initNativePlugins, isNative } from "@/lib/native";

export default function NativeInit() {
  useEffect(() => {
    initNativePlugins();

    // 네이티브 앱에서 safe area 적용
    if (isNative()) {
      document.documentElement.classList.add("native-app");
    }
  }, []);

  return null;
}
