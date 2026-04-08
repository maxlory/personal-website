import type { Metadata } from "next";
import { Caveat, Inter_Tight, League_Spartan, Newsreader } from "next/font/google";
import "./globals.css";

const bodySans = Inter_Tight({
  variable: "--font-body-sans",
  subsets: ["latin"],
  display: "swap",
});

const displaySerif = Newsreader({
  variable: "--font-display-serif",
  subsets: ["latin"],
  display: "swap",
});

const displayBlock = League_Spartan({
  variable: "--font-display-block",
  subsets: ["latin"],
  display: "swap",
});

const noteScript = Caveat({
  variable: "--font-note-script",
  weight: "700",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Su Tianrun | Warm Editorial Homepage",
  description:
    "A warm editorial personal homepage about AI, finance, product thinking, and real practice.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${bodySans.variable} ${displaySerif.variable} ${displayBlock.variable} ${noteScript.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
