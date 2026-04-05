"use client";

import { useState } from "react";
import { WidgetArea } from "@/components/widgets";
import WidgetSettings from "@/components/widgets/WidgetSettings";
import { Settings2 } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function HomeWidgets() {
  const [showSettings, setShowSettings] = useState(false);
  const activeWidgets = useStore((s) => s.activeWidgets);

  if (activeWidgets.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-xs text-muted mb-2">표시할 위젯이 없어요</p>
        <button
          onClick={() => setShowSettings(true)}
          className="text-xs text-primary font-medium"
        >
          위젯 추가하기
        </button>
        {showSettings && <WidgetSettings onClose={() => setShowSettings(false)} />}
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-muted">나의 위젯</p>
        <button
          onClick={() => setShowSettings(true)}
          className="flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors"
        >
          <Settings2 size={12} />
          편집
        </button>
      </div>
      <WidgetArea />
      {showSettings && <WidgetSettings onClose={() => setShowSettings(false)} />}
    </>
  );
}
