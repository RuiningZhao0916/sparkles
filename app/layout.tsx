import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sparkle — Human connection, sparked by AI",
  description: "Chat with AI. Find your people. The AI is just the red string.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased relative overflow-x-hidden">
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
