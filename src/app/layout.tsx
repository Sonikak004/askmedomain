import React, { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "AskMeDomain – Find a domain. Build something great.",
  description:
    "Fast, modern domain name search and registration. Transparent pricing, complimentary WHOIS privacy, and complete DNS management.",
  keywords: [
    "domain registration",
    "buy domain name",
    "domain search",
    ".com domain",
    ".in domain",
    "cheap domain registration",
    "DNS management",
    "AskMeDomain",
  ],
  authors: [{ name: "AskMeDomain" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
        <CartProvider>
          <Suspense fallback={<div className="h-18 sm:h-20 bg-white border-b border-slate-100" />}>
            <Header />
          </Suspense>
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
