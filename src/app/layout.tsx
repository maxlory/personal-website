import type { Metadata, Viewport } from "next";
import { Inter_Tight, Newsreader } from "next/font/google";
import "./globals.css";
import "./portfolio-pages.css";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sutianrun.com"),
  title: "苏天润 | AI 产品、金融与研究实践",
  description:
    "苏天润的个人作品集：以金融训练为底，通过研究、产品分析、原型与 AI 工作流验证判断。",
  openGraph: {
    title: "苏天润 | AI 产品、金融与研究实践",
    description:
      "以金融训练为底，通过研究、产品分析、原型与 AI 工作流验证判断。",
    url: "/",
    siteName: "苏天润的个人作品集",
    type: "website",
    images: [{ url: "/og.png", width: 1729, height: 910, alt: "Su Tianrun portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "苏天润 | AI 产品、金融与研究实践",
    description: "Research clearly. Build deliberately.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f5f0e6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${bodySans.variable} ${displaySerif.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
