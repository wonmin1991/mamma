"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useFocusTrap } from "@/lib/useFocusTrap";
import {
  sampleCommunityPosts,
  COMMUNITY_CATEGORIES,
  type CommunityPost,
} from "@/data/mock";
import {
  ChevronLeft,
  Heart,
  MessageCircle,
  Plus,
  X,
  Send,
  Info,
} from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { sanitizeTrim } from "@/lib/sanitize";
import { STORAGE_KEYS } from "@/lib/storage";
import { formatRelativeDate } from "@/lib/date";

export default function CommunityPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [showForm, setShowForm] = useState(false);
  const isPostLiked = useStore((s) => s.isPostLiked);
  const togglePostLike = useStore((s) => s.togglePostLike);

  const [formCategory, setFormCategory] = useState<CommunityPost["category"]>("tip");
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formAuthor, setFormAuthor] = useState("");

  useEffect(() => {
    let userPosts: CommunityPost[] = [];
    try {
      userPosts = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMUNITY) || "[]");
    } catch {
      // corrupted data — ignore
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only localStorage hydration
    setPosts([...userPosts, ...sampleCommunityPosts]);
  }, []);

  const filteredPosts = useMemo(
    () => posts.filter((p) => activeCategory === "all" || p.category === activeCategory),
    [posts, activeCategory]
  );

  const handleLike = useCallback((postId: number) => {
    const wasLiked = isPostLiked(postId);
    togglePostLike(postId);
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, likes: p.likes + (wasLiked ? -1 : 1) }
          : p
      )
    );
  }, [togglePostLike, isPostLiked]);

  const handleSubmit = () => {
    if (!formTitle.trim() || !formContent.trim()) return;

    const categoryEmojis: Record<string, string> = {
      restaurant: "🍽️",
      tip: "💡",
      question: "🤔",
      review: "✍️",
    };

    const newPost: CommunityPost = {
      id: Date.now(),
      author: sanitizeTrim(formAuthor, 20) || "익명",
      category: formCategory,
      title: sanitizeTrim(formTitle, 100),
      content: sanitizeTrim(formContent, 2000),
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString().split("T")[0],
      emoji: categoryEmojis[formCategory],
    };

    let userPosts: CommunityPost[] = [];
    try {
      userPosts = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMUNITY) || "[]");
    } catch {
      // corrupted data — start fresh
    }
    userPosts.unshift(newPost);
    try {
      localStorage.setItem(STORAGE_KEYS.COMMUNITY, JSON.stringify(userPosts));
    } catch {
      // storage quota exceeded
    }

    setPosts([newPost, ...posts]);
    setShowForm(false);
    setFormTitle("");
    setFormContent("");
    setFormAuthor("");
  };

  const formFocusRef = useFocusTrap(showForm);

  return (
    <main className="flex flex-col">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md px-5 pt-12 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="p-1 -ml-1" aria-label="뒤로가기">
              <ChevronLeft size={22} className="text-foreground" />
            </Link>
            <h1 className="text-lg font-bold text-foreground">나의 기록</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary text-white text-xs font-medium"
          >
            <Plus size={14} /> 기록 추가
          </button>
        </div>

        <div className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar -mx-5 px-5 pb-1">
          {COMMUNITY_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1
                ${activeCategory === cat.id
                  ? "bg-primary text-white shadow-sm"
                  : "bg-card text-muted border border-card-border"
                }`}
            >
              <span>{cat.emoji}</span>{cat.label}
            </button>
          ))}
        </div>
      </header>

        <div className="px-5 mt-2">
          <p className="text-xs text-muted bg-surface rounded-xl px-3 py-2 flex items-start gap-1.5">
            <Info size={12} className="flex-shrink-0 mt-0.5" />
            이 기록은 이 기기에만 저장됩니다. 설정에서 백업할 수 있어요.
          </p>
        </div>

      {/* Post form modal */}
      {showForm && (
        <div ref={formFocusRef} className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true" aria-labelledby="new-post-title">
          <button type="button" className="absolute inset-0 bg-black/40" onClick={() => setShowForm(false)} aria-label="닫기" />
          <div className="relative w-full max-w-lg bg-card rounded-t-3xl p-5 pb-8 animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h2 id="new-post-title" className="text-base font-bold text-foreground">새 기록 작성</h2>
              <button onClick={() => setShowForm(false)} className="p-1 text-muted" aria-label="닫기">
                <X size={20} />
              </button>
            </div>

            {/* Category selector */}
            <div className="flex gap-2 mb-4">
              {COMMUNITY_CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFormCategory(cat.id as CommunityPost["category"])}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all
                    ${formCategory === cat.id
                      ? "bg-primary text-white"
                      : "bg-surface text-muted border border-card-border"
                    }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="닉네임 (선택, 기본: 익명)"
              value={formAuthor}
              onChange={(e) => setFormAuthor(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface border border-card-border text-sm text-foreground mb-3 focus:outline-none focus:border-primary"
            />

            <input
              type="text"
              placeholder="제목을 입력하세요"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface border border-card-border text-sm text-foreground mb-3 focus:outline-none focus:border-primary"
            />

            <textarea
              placeholder="내용을 입력하세요"
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl bg-surface border border-card-border text-sm text-foreground mb-4 resize-none focus:outline-none focus:border-primary"
            />

            <button
              onClick={handleSubmit}
              disabled={!formTitle.trim() || !formContent.trim()}
              className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            >
              <Send size={16} /> 저장하기
            </button>
          </div>
        </div>
      )}

      {/* Posts list */}
      <section className="px-5 mt-3 pb-6">
        <p className="text-xs text-muted mb-3">총 {filteredPosts.length}개의 기록</p>

        <div className="flex flex-col gap-3">
          {filteredPosts.map((post, i) => {
            const cat = COMMUNITY_CATEGORIES.find((c) => c.id === post.category);
            const liked = isPostLiked(post.id);
            return (
              <div
                key={post.id}
                className="bg-card rounded-2xl border border-card-border shadow-sm p-4 animate-fade-in-up"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <Link href={`/community/${post.id}`} className="block">
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-light to-secondary-light flex items-center justify-center">
                      <span className="text-sm">{post.emoji}</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{post.author}</p>
                      <p className="text-xs text-muted">{formatRelativeDate(post.createdAt)}</p>
                    </div>
                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-secondary-light text-secondary font-medium">
                      {cat?.label}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-foreground leading-snug">{post.title}</h3>
                  <p className="text-sm text-muted mt-1.5 leading-relaxed line-clamp-3">{post.content}</p>
                </Link>

                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-card-border">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1 text-xs transition-colors ${
                      liked ? "text-primary" : "text-muted hover:text-primary"
                    }`}
                  >
                    <Heart size={14} fill={liked ? "currentColor" : "none"} />
                    {post.likes}
                  </button>
                  <span className="flex items-center gap-1 text-xs text-muted">
                    <MessageCircle size={14} /> {post.comments}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">💬</p>
            <p className="text-sm font-medium text-foreground">아직 기록이 없어요</p>
            <p className="text-xs text-muted mt-1">첫 번째 기록을 남겨보세요!</p>
          </div>
        )}
      </section>
    </main>
  );
}
