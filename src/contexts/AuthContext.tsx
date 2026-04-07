"use client";

import { createContext, useContext, useEffect, useState, useRef, useCallback, type ReactNode } from "react";
import { createClient } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";
import { uploadLocalDataToCloud, downloadCloudDataToLocal, scheduleSyncToCloud } from "@/lib/syncData";

interface AuthResult {
  error: string | null;
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  syncing: boolean;
  signUpWithEmail: (email: string, password: string) => Promise<AuthResult>;
  signInWithEmail: (email: string, password: string) => Promise<AuthResult>;
  signInWithGoogle: () => Promise<void>;
  signInWithKakao: () => Promise<void>;
  signOut: () => Promise<void>;
  syncNow: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const syncedRef = useRef(false);

  // 로그인 시 데이터 동기화
  const handleSync = useCallback(async (u: User) => {
    if (syncedRef.current) return;
    syncedRef.current = true;
    setSyncing(true);
    try {
      // 1) 클라우드에서 데이터 다운로드 시도
      const dl = await downloadCloudDataToLocal(u.id);
      if (dl.hasCloudData) {
        // 클라우드 데이터가 있으면 적용 후 새로고침
        window.location.reload();
        return;
      }
      // 2) 클라우드에 데이터가 없으면 로컬 데이터를 업로드
      await uploadLocalDataToCloud(u.id);
    } catch { /* ignore */ }
    setSyncing(false);
  }, []);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
      if (s?.user) handleSync(s.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => {
        setSession(s);
        setUser(s?.user ?? null);
        setLoading(false);
        if (_event === "SIGNED_IN" && s?.user) {
          syncedRef.current = false;
          handleSync(s.user);
        }
        if (_event === "SIGNED_OUT") {
          syncedRef.current = false;
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [handleSync]);

  // localStorage 변경 감지 → 자동 클라우드 동기화
  useEffect(() => {
    if (!user) return;
    const handler = () => scheduleSyncToCloud(user.id);
    window.addEventListener("storage", handler);
    // Zustand persist는 storage 이벤트를 발생시키지 않으므로 주기적 체크
    const interval = setInterval(() => scheduleSyncToCloud(user.id), 30000);
    return () => {
      window.removeEventListener("storage", handler);
      clearInterval(interval);
    };
  }, [user]);

  const signUpWithEmail = async (email: string, password: string): Promise<AuthResult> => {
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signInWithEmail = async (email: string, password: string): Promise<AuthResult> => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signInWithGoogle = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const signInWithKakao = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const signOut = async () => {
    // 로그아웃 전 최종 동기화
    if (user) await uploadLocalDataToCloud(user.id);
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const syncNow = async () => {
    if (!user) return;
    setSyncing(true);
    await uploadLocalDataToCloud(user.id);
    setSyncing(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, syncing, signUpWithEmail, signInWithEmail, signInWithGoogle, signInWithKakao, signOut, syncNow }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
