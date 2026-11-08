import { Manrope, Ubuntu_Mono, Tiny5 } from "next/font/google";

export const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const ubuntuMono = Ubuntu_Mono({
  variable: "--font-ubuntu-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const tiny5 = Tiny5({
  variable: "--font-tiny5",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});
