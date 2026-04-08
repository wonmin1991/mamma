import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { PregnancyProvider } from "@/contexts/PregnancyContext";
import OnboardingModal from "@/components/OnboardingModal";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";
import AutoBackupAlert from "@/components/AutoBackupAlert";
import NativeInit from "@/components/NativeInit";
import { AuthProvider } from "@/contexts/AuthContext";
import { Analytics } from "@vercel/analytics/next";
import { BASE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `${SITE_NAME} — 임산부를 위한 모든 정보`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE_NAME,
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — 임산부를 위한 모든 정보`,
    description: SITE_DESCRIPTION,
    locale: "ko_KR",
    url: BASE_URL,
  },
  twitter: {
    card: "summary",
    title: `${SITE_NAME} — 임산부를 위한 모든 정보`,
    description: SITE_DESCRIPTION,
  },
  alternates: {
    canonical: BASE_URL,
  },
  keywords: [
    "임산부",
    "임신",
    "출산",
    "맛집",
    "임산부맛집",
    "주차별가이드",
    "임신꿀팁",
    "태교",
    "출산준비",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FFF9F5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("mamma-theme")==="dark"||(!localStorage.getItem("mamma-theme")&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}`,
          }}
        />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ServiceWorkerRegister />
        <NativeInit />
        <Analytics />
        <AuthProvider>
        <PregnancyProvider>
          <MedicalDisclaimer />
          <OnboardingModal />
          <AutoBackupAlert />
          <div className="flex-1 mx-auto w-full max-w-lg pb-20">{children}</div>
          <BottomNav />
        </PregnancyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
