"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const { user, loading, signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithKakao } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/");
  }, [user, loading, router]);

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim() || !password.trim()) {
      setError("이메일과 비밀번호를 입력해주세요");
      return;
    }
    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 해요");
      return;
    }

    setSubmitting(true);
    if (mode === "signup") {
      const result = await signUpWithEmail(email, password);
      if (result.error) {
        setError(result.error === "User already registered" ? "이미 가입된 이메일이에요" : result.error);
      } else {
        setSuccess("인증 이메일을 보냈어요! 메일함을 확인해주세요.");
      }
    } else {
      const result = await signInWithEmail(email, password);
      if (result.error) {
        setError(result.error === "Invalid login credentials" ? "이메일 또는 비밀번호가 맞지 않아요" : result.error);
      }
    }
    setSubmitting(false);
  };

  return (
    <main className="flex flex-col min-h-screen">
      <header className="px-5 pt-12 pb-3">
        <Link href="/" className="p-1 -ml-1 inline-block" aria-label="뒤로가기">
          <ChevronLeft size={22} className="text-foreground" />
        </Link>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center px-5 pb-20">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-light to-secondary-light flex items-center justify-center mb-6">
          <span className="text-4xl">🤰</span>
        </div>

        <h1 className="text-2xl font-bold text-foreground text-center">
          맘마<span className="text-primary">.</span>
        </h1>
        <p className="text-sm text-muted mt-2 text-center leading-relaxed">
          {mode === "login"
            ? "로그인하면 데이터가 클라우드에 안전하게 저장돼요"
            : "간단하게 가입하고 맞춤 정보를 받아보세요"}
        </p>

        <div className="w-full max-w-sm mt-8">
          {/* Email/Password form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-surface border border-card-border text-sm text-foreground focus:outline-none focus:border-primary"
                autoComplete="email"
              />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호 (6자 이상)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3.5 rounded-2xl bg-surface border border-card-border text-sm text-foreground focus:outline-none focus:border-primary"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-500 px-1">{error}</p>
            )}
            {success && (
              <p className="text-xs text-emerald-500 px-1">{success}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl bg-primary text-white font-semibold text-sm disabled:opacity-50 active:scale-[0.98] transition-all"
            >
              {submitting
                ? "처리 중..."
                : mode === "login"
                  ? "로그인"
                  : "회원가입"}
            </button>
          </form>

          <button
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); setSuccess(null); }}
            className="w-full text-center mt-3 text-xs text-muted"
          >
            {mode === "login"
              ? "계정이 없으신가요? 회원가입"
              : "이미 계정이 있으신가요? 로그인"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-card-border" />
            <span className="text-xs text-muted">또는</span>
            <div className="flex-1 h-px bg-card-border" />
          </div>

          {/* Social login */}
          <div className="flex flex-col gap-3">
            <button
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-white text-gray-700 font-medium text-sm border border-gray-200 shadow-sm active:scale-[0.98] transition-transform"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Google로 계속하기
            </button>

            <button
              onClick={signInWithKakao}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl font-medium text-sm active:scale-[0.98] transition-transform"
              style={{ backgroundColor: "#FEE500", color: "#000000D9" }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 1C4.582 1 1 3.87 1 7.404c0 2.29 1.494 4.305 3.749 5.448l-.956 3.478c-.082.3.258.54.52.367l4.146-2.73c.178.013.357.02.541.02 4.418 0 8-2.87 8-6.583C17 3.87 13.418 1 9 1z" fill="#000000D9"/>
              </svg>
              카카오로 계속하기
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-muted hover:text-foreground transition-colors">
              로그인 없이 둘러보기
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
