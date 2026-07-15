import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Outfit, Poppins, Ubuntu } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Suspense } from "react";

import GAListener from "@/lib/ga-listener";
import Preloader from "@/components/custom-new/preloader";
import { ThemeProvider } from "@/components/theme-provider";


const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});


export const metadata: Metadata = {
  title: "Kaium Al Limon | Full-Stack Developer",
  description: "Personal portfolio of Kaium Al Limon, a Full-Stack Cross-Platform Mobile & Web Developer specializing in Flutter & Next.js. Computer Science student at UIU.",
  keywords: ["Kaium Al Limon", "Full-Stack Developer", "Flutter Developer", "Next.js Developer", "Web Developer", "Mobile Developer", "UIU", "Bangladesh", "Portfolio"],
  authors: [{ name: "Kaium Al Limon", url: "https://github.com/kaiumallimon" }],
  creator: "Kaium Al Limon",
  publisher: "Kaium Al Limon",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kaiumallimon.vercel.app",
    title: "Kaium Al Limon | Full-Stack Developer",
    description: "Personal portfolio of Kaium Al Limon, a Full-Stack Cross-Platform Mobile & Web Developer specializing in Flutter & Next.js.",
    siteName: "Kaium Al Limon Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaium Al Limon | Full-Stack Developer",
    description: "Personal portfolio of Kaium Al Limon, a Full-Stack Cross-Platform Mobile & Web Developer.",
    creator: "@kaiumallimon",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${ubuntu.className}`}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-T8EL28VE67"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-T8EL28VE67');
          `}
        </Script>

        {/* SPA pageview listener */}
        <Suspense fallback={null}>
          <Preloader />
          <GAListener />
        </Suspense>

        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );

}
