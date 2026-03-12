import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Commercial Tarot Service",
  description: "Draw your tarot cards interactively",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
