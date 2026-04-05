"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { WIDGET_REGISTRY } from "./index";
import { X, GripVertical, Check } from "lucide-react";

interface Props {
  onClose: () => void;
}

export default function WidgetSettings({ onClose }: Props) {
  const activeWidgets = useStore((s) => s.activeWidgets);
  const setActiveWidgets = useStore((s) => s.setActiveWidgets);

  const [localOrder, setLocalOrder] = useState<string[]>(() => {
    // Active widgets first (in order), then inactive ones
    const inactive = WIDGET_REGISTRY
      .map((w) => w.id)
      .filter((id) => !activeWidgets.includes(id));
    return [...activeWidgets, ...inactive];
  });

  const [localActive, setLocalActive] = useState<Set<string>>(
    () => new Set(activeWidgets)
  );

  const toggleItem = (id: string) => {
    setLocalActive((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const moveUp = (idx: number) => {
    if (idx <= 0) return;
    setLocalOrder((prev) => {
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  };

  const moveDown = (idx: number) => {
    if (idx >= localOrder.length - 1) return;
    setLocalOrder((prev) => {
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  };

  const handleSave = () => {
    const result = localOrder.filter((id) => localActive.has(id));
    setActiveWidgets(result);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-card rounded-t-3xl shadow-2xl animate-fade-in-up max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-card-border">
          <h2 className="text-base font-bold text-foreground">위젯 설정</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-surface transition-colors" aria-label="닫기">
            <X size={20} className="text-muted" />
          </button>
        </div>

        <p className="px-5 pt-3 text-xs text-muted">
          홈 화면에 표시할 위젯을 선택하고 순서를 변경하세요
        </p>

        {/* Widget list */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          <div className="flex flex-col gap-2">
            {localOrder.map((id, idx) => {
              const widget = WIDGET_REGISTRY.find((w) => w.id === id);
              if (!widget) return null;
              const isActive = localActive.has(id);

              return (
                <div
                  key={id}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    isActive
                      ? "bg-card border-card-border shadow-sm"
                      : "bg-surface border-transparent opacity-60"
                  }`}
                >
                  {/* Reorder buttons */}
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => moveUp(idx)}
                      disabled={idx === 0}
                      className="text-muted disabled:opacity-20 hover:text-foreground transition-colors"
                      aria-label="위로 이동"
                    >
                      <GripVertical size={14} />
                    </button>
                  </div>

                  {/* Toggle */}
                  <button
                    onClick={() => toggleItem(id)}
                    className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                      isActive
                        ? "bg-primary text-white"
                        : "bg-surface border border-card-border text-transparent"
                    }`}
                  >
                    <Check size={14} />
                  </button>

                  {/* Info */}
                  <span className="text-xl">{widget.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{widget.name}</p>
                    <p className="text-[11px] text-muted">{widget.description}</p>
                  </div>

                  {/* Move buttons */}
                  {isActive && (
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => moveUp(idx)}
                        disabled={idx === 0}
                        className="text-[10px] text-muted disabled:opacity-20"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => moveDown(idx)}
                        disabled={idx === localOrder.length - 1}
                        className="text-[10px] text-muted disabled:opacity-20"
                      >
                        ▼
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Save button */}
        <div className="px-5 py-4 border-t border-card-border">
          <button
            onClick={handleSave}
            className="w-full py-3.5 rounded-2xl bg-primary text-white font-semibold text-sm active:scale-[0.98] transition-transform"
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
}
