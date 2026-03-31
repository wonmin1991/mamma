"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

export default function ServiceWorkerRegister() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "activated" &&
              navigator.serviceWorker.controller
            ) {
              setUpdateAvailable(true);
            }
          });
        });
      })
      .catch(() => {});
  }, []);

  if (!updateAvailable) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] animate-fade-in-up">
      <button
        onClick={() => globalThis.location.reload()}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium shadow-lg"
      >
        <RefreshCw size={14} />
        새 버전이 있어요. 탭하여 업데이트
      </button>
    </div>
  );
}
