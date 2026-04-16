import type { Metadata } from "next";
import "./globals.css";
import AmbientScene from "@/components/AmbientScene";

export const metadata: Metadata = {
  title: "Sparkle — Human connection, sparked by AI",
  description: "Chat with AI. Find your people. The AI is just the red string.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0a0f] text-[#f5f5f0] antialiased relative overflow-x-hidden">
        <AmbientScene />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
