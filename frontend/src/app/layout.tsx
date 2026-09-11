import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VoiceShield - Real-Time Voice Impersonation Risk & Prevention",
  description: "Near-real-time voice clone, audio spoof detection, and social engineering risk mitigation platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased text-on-surface" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
