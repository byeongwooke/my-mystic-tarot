import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";

export const metadata: Metadata = {
  title: "운명의 타로 | 프리미엄 타로 해석",
  description: "당신의 운명을 읽어드리는 신비로운 공간. 오늘의 운세, 고민뽑기, 켈틱 크로스 타로 해석을 통해 삶의 방향을 통찰해보세요.",
  keywords: ["타로", "운세", "오늘의 운세", "켈틱크로스", "운명", "타로점", "연애운", "재물운", "직업운"],
  openGraph: {
    title: "운명의 타로",
    description: "당신의 운명을 읽어드리는 신비로운 공간",
    url: "https://my-mystic-tarot.vercel.app",
    siteName: "운명의 타로",
    images: [
      {
        url: "/card_back.webp",
        width: 800,
        height: 800,
        alt: "운명의 타로 메인 이미지",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  manifest: "/manifest.json",
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a2320", 
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
