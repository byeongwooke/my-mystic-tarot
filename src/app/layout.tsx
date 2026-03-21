import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";

export const metadata: Metadata = {
  title: "운명의 타로",
  description: "당신의 운명을 읽어드리는 신비로운 공간",
  // 낡은 apple- 태그 대신 표준 형식을 지원하도록 설정
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes", // 하위 호환성을 위해 남기되 경고 방지용 처리
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#020617", // slate-950 색상
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="dark">
      <body className="bg-slate-950 antialiased overflow-x-hidden">
        <AuthProvider>
          <Link href="/" className="fixed top-4 right-4 z-[9999] p-2.5 bg-slate-800/80 backdrop-blur-md border border-emerald-500/40 rounded-full text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:bg-slate-700 hover:scale-110 active:scale-95 transition-all group">
            <span className="sr-only">홈으로 가기</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6 group-hover:text-emerald-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </Link>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
