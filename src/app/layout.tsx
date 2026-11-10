import type { Metadata } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jbMono = JetBrains_Mono({
  variable: "--font-jbmono",
  subsets: ["latin"],
  display: "swap",
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SANDY — Video Editor & Motion Designer",
  description:
    "Portfolio of SANDY, a video editor and motion designer working with AI and traditional editing workflows, color grading, and editorial storytelling.",
  keywords: [
    "video editor",
    "motion designer",
    "portfolio",
    "editorial",
    "color grading",
    "post-production",
  ],
  authors: [{ name: "SANDY" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "SANDY — Video Editor & Motion Designer",
    description:
      "AI and traditional video editing, color grading, and editorial storytelling.",
    siteName: "SANDY Portfolio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jbMono.variable} ${instrument.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
