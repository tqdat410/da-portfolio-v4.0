import type { Metadata, Viewport } from "next";
import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { content } from "@/content";
import "./globals.css";

// Google Fonts - Style Script & Luxurious Roman
const googleFontsLink = (
  <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link
      href="https://fonts.googleapis.com/css2?family=Luxurious+Roman&family=Pacifico&family=Style+Script&display=swap"
      rel="stylesheet"
    />
  </>
);

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
  maximumScale: 5,
  userScalable: true,
  themeColor: "#0a0a0a",
};

export const metadata: Metadata = {
  title: {
    default: content.hero.name,
    template: `%s | ${content.hero.name}`,
  },
  description: content.hero.description,
  keywords: [
    "software engineer",
    "portfolio",
    "SAP consultant",
    "web developer",
    "React",
    "Next.js",
    "TypeScript",
    "Tran Quoc Dat",
  ],
  authors: [{ name: content.hero.name }],
  creator: content.hero.name,
  metadataBase: new URL("https://tranquocdat.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: `${content.hero.name} | ${content.hero.role}`,
    description: content.hero.description,
    siteName: content.hero.name,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${content.hero.name} | ${content.hero.role}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${content.hero.name} | ${content.hero.role}`,
    description: content.hero.description,
    creator: "@trandat40",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>{googleFontsLink}</head>
      <body className="bg-midnight text-light-mint antialiased">
        {children}
      </body>
    </html>
  );
}
