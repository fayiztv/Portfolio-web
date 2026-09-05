import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ReducedMotionProvider } from "@/components/providers/reduced-motion-provider";
import { LenisProvider } from "@/components/providers/lenis-provider";

const clashDisplay = localFont({
  src: "./fonts/ClashDisplay-Semibold.woff2",
  variable: "--font-clash-display",
  weight: "600",
  display: "swap",
});

const generalSans = localFont({
  src: "./fonts/GeneralSans-Regular.woff2",
  variable: "--font-general-sans",
  weight: "400",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Muhammed Fayiz TV - Full Stack Software Engineer",
  description: "Interactive digital workspace of Muhammed Fayiz TV",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${clashDisplay.variable} ${generalSans.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased bg-grain bg-background text-foreground overflow-x-hidden min-h-screen">
        <ReducedMotionProvider>
          <LenisProvider>
            {children}
          </LenisProvider>
        </ReducedMotionProvider>
      </body>
    </html>
  );
}
