"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  sampleCommunityPosts,
  COMMUNITY_CATEGORIES,
  type CommunityPost,
} from "@/data/mock";
import { ChevronLeft, Heart, MessageCircle, Send, Flag, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import ReportModal from "@/components/ReportModal";

interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
  likes: number;
}

const COMMENTS_KEY = "mamma-comments";

export default function CommunityDetailPage() {
  const params = useParams();
  const postId = Number(params.id);

  const [post, setPost] = useState<CommunityPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [likeOffset, setLikeOffset] = useState(0);
  const isLiked = useStore((s) => s.isPostLiked(postId));
  const togglePostLike = useStore((s) => s.togglePostLike);

  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTarget, setReportTarget] = useState<{
    id: number;
    type: "post" | "comment";
  } | null>(null);
  const [showPostMenu, setShowPostMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  const likeCount = useMemo(() => (post?.likes ?? 0) + likeOffset, [post, likeOffset]);

  useEffect(() => {
    let userPosts: CommunityPost[] = [];
    try {
      userPosts = JSON.parse(localStorage.getItem("mamma-community") || "[]");
    } catch { /* corrupted data */ }

    const allPosts = [...userPosts, ...sampleCommunityPosts];
    const found = allPosts.find((p) => p.id === postId);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only localStorage hydration
    if (found) setPost(found);

    let allComments: Record<string, Comment[]> = {};
    try {
      allComments = JSON.parse(localStorage.getItem(COMMENTS_KEY) || "{}");
    } catch { /* corrupted data */ }
    setComments(allComments[String(postId)] || []);
    setLoading(false);
  }, [postId]);

  const handleLike = () => {
    const delta = isLiked ? -1 : 1;
    togglePostLike(postId);
    setLikeOffset((prev) => prev + delta);
  };

  const handleCommentSubmit = () => {
    if (!commentContent.trim()) return;

    const newComment: Comment = {
      id: Date.now(),
      author: commentAuthor.trim() || "익명",
      content: commentContent.trim(),
      createdAt: new Date().toISOString().split("T")[0],
      likes: 0,
    };

    let allComments: Record<string, Comment[]> = {};
    try {
      allComments = JSON.parse(localStorage.getItem(COMMENTS_KEY) || "{}");
    } catch { /* corrupted data */ }
    const postComments = allComments[String(postId)] || [];
    postComments.push(newComment);
    allComments[String(postId)] = postComments;
    try {
      localStorage.setItem(COMMENTS_KEY, JSON.stringify(allComments));
    } catch { /* quota exceeded */ }

    setComments(postComments);
    setCommentContent("");
    setCommentAuthor("");
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "오늘";
    if (diff === 1) return "어제";
    if (diff < 7) return `${diff}일 전`;
    return dateStr;
  };

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-primary-light" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
        </div>
        <p className="text-sm text-muted animate-pulse">불러오는 중...</p>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-4xl mb-3">😢</p>
        <p className="text-sm font-medium text-foreground">글을 찾을 수 없어요</p>
        <Link href="/community" className="mt-4 text-sm text-primary font-medium">
          커뮤니티로 돌아가기
        </Link>
      </main>
    );
  }

  const cat = COMMUNITY_CATEGORIES.find((c) => c.id === post.category);
  const totalComments = comments.length + post.comments;

  return (
    <main className="flex flex-col">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md px-5 pt-12 pb-3">
        <div className="flex items-center gap-2">
          <Link href="/community" className="p-1 -ml-1" aria-label="뒤로가기">
            <ChevronLeft size={22} className="text-foreground" />
          </Link>
          <h1 className="text-lg font-bold text-foreground">게시글</h1>
          <div className="ml-auto relative">
            <button
              onClick={() => setShowPostMenu(!showPostMenu)}
              className="p-2 rounded-full hover:bg-surface transition-colors"
              aria-label="더보기 메뉴"
            >
              <MoreHorizontal size={20} className="text-muted" />
            </button>
            {showPostMenu && (
              <div className="absolute right-0 top-10 bg-card rounded-xl border border-card-border shadow-lg py-1 z-50 min-w-[120px] animate-fade-in-up">
                <button
                  onClick={() => {
                    setShowPostMenu(false);
                    setReportTarget({ id: postId, type: "post" });
                    setShowReportModal(true);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-surface transition-colors"
                >
                  <Flag size={14} />
                  신고하기
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Post content */}
      <section className="px-5">
        <article className="bg-card rounded-2xl border border-card-border shadow-sm p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-light to-secondary-light flex items-center justify-center">
              <span className="text-lg">{post.emoji}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{post.author}</p>
              <p className="text-xs text-muted">{formatDate(post.createdAt)}</p>
            </div>
            <span className="ml-auto text-xs px-2.5 py-0.5 rounded-full bg-secondary-light text-secondary font-medium">
              {cat?.label}
            </span>
          </div>

          <h2 className="text-base font-bold text-foreground leading-snug">{post.title}</h2>
          <p className="text-sm text-foreground mt-3 leading-relaxed whitespace-pre-wrap">{post.content}</p>

          <div className="flex items-center gap-4 mt-5 pt-4 border-t border-card-border">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isLiked
                  ? "bg-primary-light text-primary"
                  : "bg-surface text-muted border border-card-border hover:text-primary"
              }`}
            >
              <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
              {likeCount}
            </button>
            <span className="flex items-center gap-1.5 text-sm text-muted">
              <MessageCircle size={16} />
              {totalComments}
            </span>
          </div>
        </article>
      </section>

      {/* Comments */}
      <section className="px-5 mt-4 pb-6">
        <h3 className="font-bold text-sm text-foreground mb-3 flex items-center gap-1.5">
          <MessageCircle size={14} className="text-secondary" />
          댓글 {comments.length}개
        </h3>

        {comments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-2xl mb-2">💬</p>
            <p className="text-xs text-muted">첫 번째 댓글을 남겨보세요!</p>
          </div>
        )}

        <div className="flex flex-col gap-3 mb-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-card rounded-xl border border-card-border p-4 animate-fade-in-up"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-surface-violet flex items-center justify-center">
                    <span className="text-xs">😊</span>
                  </div>
                  <span className="text-xs font-semibold text-foreground">{comment.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted">{formatDate(comment.createdAt)}</span>
                  <button
                    onClick={() => {
                      setReportTarget({ id: comment.id, type: "comment" });
                      setShowReportModal(true);
                    }}
                    className="p-0.5 text-muted hover:text-red-400 transition-colors"
                    aria-label="댓글 신고"
                  >
                    <Flag size={10} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{comment.content}</p>
            </div>
          ))}
        </div>

        {/* Comment form */}
        <div className="bg-card rounded-2xl border border-card-border shadow-sm p-4">
          <input
            type="text"
            placeholder="닉네임 (선택)"
            value={commentAuthor}
            onChange={(e) => setCommentAuthor(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-surface border border-card-border text-xs text-foreground mb-2 focus:outline-none focus:border-primary"
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="댓글을 입력하세요..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit()}
              className="flex-1 px-3 py-2.5 rounded-xl bg-surface border border-card-border text-sm text-foreground focus:outline-none focus:border-primary"
            />
            <button
              onClick={handleCommentSubmit}
              disabled={!commentContent.trim()}
              className="px-4 py-2.5 rounded-xl bg-primary text-white disabled:opacity-40 transition-opacity"
              aria-label="댓글 보내기"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </section>

      {showReportModal && reportTarget && (
        <ReportModal
          targetId={reportTarget.id}
          targetType={reportTarget.type}
          onClose={() => {
            setShowReportModal(false);
            setReportTarget(null);
          }}
        />
      )}
    </main>
  );
}
