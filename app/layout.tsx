import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sparkle — Human connection, sparked by AI",
  description: "Chat with AI. Find your people. The AI is just the red string.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-screen bg-white font-sans text-gray-900 antialiased relative overflow-x-hidden">
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
