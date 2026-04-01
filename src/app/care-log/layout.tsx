import type { Metadata } from "next";

export const metadata: Metadata = { title: "육아 기록" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
