import type { Metadata, Viewport } from "next";
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
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
