"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Plus,
  Trash2,
  X,
  Camera,
  Image as ImageIcon,
  Calendar,
  Hospital,
  StickyNote,
} from "lucide-react";
import { useBabyStore, type UltrasoundPhoto } from "@/store/useBabyStore";
import { usePregnancy } from "@/contexts/PregnancyContext";
import { weeklyGuide } from "@/data/mock";

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function compressImage(file: File, maxWidth = 1200): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ratio = Math.min(1, maxWidth / img.width);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function UltrasoundPage() {
  const { currentWeek } = usePregnancy();
  const ultrasoundPhotos = useBabyStore((s) => s.ultrasoundPhotos);
  const addUltrasoundPhoto = useBabyStore((s) => s.addUltrasoundPhoto);
  const deleteUltrasoundPhoto = useBabyStore((s) => s.deleteUltrasoundPhoto);

  const [showDialog, setShowDialog] = useState(false);
  const [viewPhoto, setViewPhoto] = useState<UltrasoundPhoto | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state
  const [formWeek, setFormWeek] = useState(currentWeek || 12);
  const [formDate, setFormDate] = useState(todayStr());
  const [formMemo, setFormMemo] = useState("");
  const [formHospital, setFormHospital] = useState("");
  const [formImage, setFormImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Group by week
  const groupedByWeek = useMemo(() => {
    const map = new Map<number, UltrasoundPhoto[]>();
    const sorted = [...ultrasoundPhotos].sort((a, b) => b.week - a.week || b.date.localeCompare(a.date));
    for (const photo of sorted) {
      if (!map.has(photo.week)) map.set(photo.week, []);
      map.get(photo.week)!.push(photo);
    }
    return Array.from(map.entries());
  }, [ultrasoundPhotos]);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const compressed = await compressImage(file);
      setFormImage(compressed);
    } catch {
      alert("이미지를 불러올 수 없습니다.");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  }, []);

  function openAddDialog() {
    setFormWeek(currentWeek || 12);
    setFormDate(todayStr());
    setFormMemo("");
    setFormHospital("");
    setFormImage(null);
    setShowDialog(true);
  }

  function handleSave() {
    if (!formImage) return;
    // localStorage 용량 체크 (대략 추정)
    try {
      const currentSize = new Blob(Object.values(localStorage)).size;
      const newSize = new Blob([formImage]).size;
      if (currentSize + newSize > 4.5 * 1024 * 1024) {
        alert("저장 공간이 부족해요. 설정 > 데이터 관리에서 백업 후 오래된 사진을 삭제해주세요.");
        return;
      }
    } catch { /* 용량 체크 실패 시 그냥 저장 시도 */ }
    addUltrasoundPhoto({
      week: formWeek,
      imageData: formImage,
      memo: formMemo.trim() || undefined,
      hospital: formHospital.trim() || undefined,
      date: formDate,
    });
    setShowDialog(false);
  }

  function handleDelete(id: string) {
    deleteUltrasoundPhoto(id);
    setDeleteConfirmId(null);
    setViewPhoto(null);
  }

  return (
    <main className="flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md px-5 pt-12 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="p-1 -ml-1" aria-label="뒤로가기">
              <ChevronLeft size={22} className="text-foreground" />
            </Link>
            <h1 className="text-lg font-bold text-foreground">초음파 앨범</h1>
          </div>
          <button
            onClick={openAddDialog}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-white text-xs font-medium"
          >
            <Plus size={14} /> 사진 추가
          </button>
        </div>
      </header>

      <section className="px-5 pb-28">
        {/* Summary */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-4 border border-card-border mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Camera size={24} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                {ultrasoundPhotos.length > 0
                  ? `총 ${ultrasoundPhotos.length}장의 초음파 사진`
                  : "아직 초음파 사진이 없어요"}
              </p>
              <p className="text-xs text-muted mt-0.5">
                {ultrasoundPhotos.length > 0
                  ? "주차별로 아기의 성장 과정을 기록해보세요"
                  : "병원에서 받은 초음파 사진을 추가해보세요"}
              </p>
            </div>
          </div>
        </div>

        {/* Empty state */}
        {ultrasoundPhotos.length === 0 && (
          <div className="flex flex-col items-center py-16 gap-4">
            <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center">
              <ImageIcon size={36} className="text-muted" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">초음파 사진을 등록해보세요</p>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                마미톡, 병원 앱에서 저장한 사진이나
                <br />
                직접 촬영한 사진을 올릴 수 있어요
              </p>
            </div>
            <button
              onClick={openAddDialog}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-medium"
            >
              <Plus size={16} /> 첫 사진 추가하기
            </button>
          </div>
        )}

        {/* Grouped by week */}
        {groupedByWeek.map(([week, photos]) => {
          const guide = weeklyGuide[Math.max(0, Math.min(39, week - 1))];
          return (
          <div key={week} className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-white bg-primary px-2.5 py-1 rounded-full">
                {week}주
              </span>
              <span className="text-xs text-muted">{photos.length}장</span>
            </div>

            {/* Week guide card */}
            <div className="bg-card rounded-xl border border-card-border p-3 mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{guide.babySizeEmoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground">
                    {guide.babySize} 크기 · {guide.babyWeight}
                  </p>
                  <p className="text-[11px] text-muted mt-0.5 line-clamp-2">
                    {guide.babyDevelopment[0]}
                  </p>
                </div>
                <Link
                  href={`/guide?week=${week}`}
                  className="flex-shrink-0 text-[10px] text-primary font-medium"
                >
                  자세히 →
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {photos.map((photo) => (
                <button
                  key={photo.id}
                  onClick={() => setViewPhoto(photo)}
                  className="relative aspect-square rounded-2xl overflow-hidden border border-card-border shadow-sm bg-card group"
                >
                  <img
                    src={photo.imageData}
                    alt={`${photo.week}주 초음파`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2.5">
                    <p className="text-[11px] text-white font-medium">
                      {photo.date.replace(/-/g, ".")}
                    </p>
                    {photo.hospital && (
                      <p className="text-[10px] text-white/70">{photo.hospital}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
          );
        })}
      </section>

      {/* ── Photo View Modal ── */}
      {viewPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
          <div className="flex items-center justify-between px-4 pt-12 pb-3">
            <button onClick={() => setViewPhoto(null)} className="p-2 text-white">
              <X size={22} />
            </button>
            <span className="text-sm font-bold text-white">{viewPhoto.week}주 초음파</span>
            <button
              onClick={() => setDeleteConfirmId(viewPhoto.id)}
              className="p-2 text-red-400"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center px-4">
            <img
              src={viewPhoto.imageData}
              alt={`${viewPhoto.week}주 초음파`}
              className="max-w-full max-h-[60vh] object-contain rounded-xl"
            />
          </div>

          <div className="px-5 py-4 bg-black/50 max-h-[40vh] overflow-y-auto">
            <div className="flex items-center gap-3 text-white/80 text-xs">
              <span className="flex items-center gap-1">
                <Calendar size={12} /> {viewPhoto.date.replace(/-/g, ".")}
              </span>
              {viewPhoto.hospital && (
                <span className="flex items-center gap-1">
                  <Hospital size={12} /> {viewPhoto.hospital}
                </span>
              )}
            </div>
            {viewPhoto.memo && (
              <p className="text-sm text-white/90 mt-2 flex items-start gap-1.5">
                <StickyNote size={12} className="flex-shrink-0 mt-0.5" />
                {viewPhoto.memo}
              </p>
            )}

            {/* Week guide info */}
            {(() => {
              const g = weeklyGuide[Math.max(0, Math.min(39, viewPhoto.week - 1))];
              return (
                <div className="mt-3 pt-3 border-t border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{g.babySizeEmoji}</span>
                    <p className="text-xs text-white font-semibold">
                      {viewPhoto.week}주 아기 — {g.babySize} 크기 · {g.babyWeight}
                      {g.babyLength !== "-" && ` · ${g.babyLength}`}
                    </p>
                  </div>
                  <ul className="flex flex-col gap-1">
                    {g.babyDevelopment.slice(0, 3).map((d, i) => (
                      <li key={i} className="text-[11px] text-white/80 flex items-start gap-1.5">
                        <span className="text-white/50 mt-px">•</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/guide?week=${viewPhoto.week}`}
                    className="inline-block mt-2 text-[11px] text-primary font-medium"
                    onClick={() => setViewPhoto(null)}
                  >
                    {viewPhoto.week}주 가이드 전체보기 →
                  </Link>
                </div>
              );
            })()}
          </div>

          {/* Delete confirm */}
          {deleteConfirmId && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-8">
              <div className="bg-card rounded-2xl p-5 w-full max-w-sm text-center">
                <p className="text-sm font-bold text-foreground">이 사진을 삭제할까요?</p>
                <p className="text-xs text-muted mt-1">삭제하면 복구할 수 없어요</p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="flex-1 py-2.5 rounded-xl bg-surface text-foreground text-sm font-medium border border-card-border"
                  >
                    취소
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirmId)}
                    className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Add Dialog ── */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowDialog(false)} />

          <div className="relative w-full max-w-lg bg-card rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up">
            <div className="sticky top-0 bg-card z-10 flex items-center justify-between px-5 pt-5 pb-3 border-b border-card-border">
              <h2 className="text-base font-bold text-foreground">초음파 사진 추가</h2>
              <button onClick={() => setShowDialog(false)} className="p-1 text-muted">
                <X size={20} />
              </button>
            </div>

            <div className="px-5 py-4 flex flex-col gap-4">
              {/* Image upload */}
              <div>
                <p className="text-xs text-muted mb-2">사진</p>
                {formImage ? (
                  <div className="relative">
                    <img
                      src={formImage}
                      alt="미리보기"
                      className="w-full aspect-video object-contain rounded-xl bg-surface border border-card-border"
                    />
                    <button
                      onClick={() => setFormImage(null)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="w-full aspect-video rounded-xl border-2 border-dashed border-card-border bg-surface flex flex-col items-center justify-center gap-2 transition-colors hover:border-primary"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Camera size={28} className="text-muted" />
                        <span className="text-xs text-muted">
                          탭하여 사진 선택
                        </span>
                      </>
                    )}
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Week */}
              <div>
                <p className="text-xs text-muted mb-2">임신 주차</p>
                <div className="flex items-center gap-3">
                  <select
                    value={formWeek}
                    onChange={(e) => setFormWeek(Number(e.target.value))}
                    className="flex-1 px-3 py-2.5 rounded-xl bg-surface border border-card-border text-sm text-foreground focus:outline-none focus:border-primary"
                  >
                    {Array.from({ length: 40 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}주
                      </option>
                    ))}
                  </select>
                  <span className="text-xs text-muted whitespace-nowrap">
                    현재 {currentWeek}주
                  </span>
                </div>
              </div>

              {/* Date */}
              <div>
                <p className="text-xs text-muted mb-2">촬영일</p>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface border border-card-border text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              {/* Hospital */}
              <div>
                <p className="text-xs text-muted mb-2">병원 (선택)</p>
                <input
                  type="text"
                  placeholder="예: OO산부인과"
                  value={formHospital}
                  onChange={(e) => setFormHospital(e.target.value)}
                  maxLength={30}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface border border-card-border text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              {/* Memo */}
              <div>
                <p className="text-xs text-muted mb-2">메모 (선택)</p>
                <textarea
                  placeholder="예: 첫 심장소리 확인! 건강하게 자라고 있대요"
                  value={formMemo}
                  onChange={(e) => setFormMemo(e.target.value)}
                  maxLength={200}
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface border border-card-border text-sm text-foreground focus:outline-none focus:border-primary resize-none"
                />
              </div>

              {/* Save */}
              <button
                onClick={handleSave}
                disabled={!formImage}
                className="w-full py-3.5 rounded-2xl bg-primary text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
