import { Geist, Geist_Mono, Tiny5 } from "next/font/google";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const tiny5 = Tiny5({
  variable: "--font-tiny5",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

// Backward-compatibility aliases so Geist & Geist Mono replace all legacy references
export const manrope = geistSans;
export const ubuntuMono = geistMono;
