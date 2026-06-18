import type { Metadata, Viewport } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Suspense } from "react";

import GAListener from "@/lib/ga-listener";
import Preloader from "@/components/custom-new/preloader";

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kaiumallimon.tech"),
  title: "Kaium Al Limon | Flutter Developer",
  description:
    "Flutter Developer crafting cross-platform mobile experiences with clean architecture, expressive UIs, and production-ready Dart code for iOS and Android.",
  keywords: [
    "Kaium Al Limon",
    "Flutter Developer",
    "Dart Developer",
    "Cross-Platform Mobile Developer",
    "iOS Developer",
    "Android Developer",
    "BLoC",
    "Provider",
    "Firebase",
    "Mobile App Developer",
    "UIU",
    "Bangladesh",
    "Portfolio",
  ],
  authors: [{ name: "Kaium Al Limon", url: "https://github.com/kaiumallimon" }],
  creator: "Kaium Al Limon",
  publisher: "Kaium Al Limon",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kaiumallimon.tech",
    title: "Kaium Al Limon | Flutter Developer",
    description:
      "Flutter Developer crafting cross-platform mobile experiences with clean architecture, expressive UIs, and production-ready Dart code for iOS and Android.",
    siteName: "Kaium Al Limon — Flutter Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaium Al Limon | Flutter Developer",
    description:
      "Flutter Developer crafting cross-platform mobile apps with clean architecture, expressive UIs, and production-ready Dart.",
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

export const viewport: Viewport = {
  themeColor: "#020617",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${ubuntu.className} bg-slate-950 text-slate-300 antialiased`}
        suppressHydrationWarning
      >
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

        <Suspense fallback={null}>
          <Preloader />
          <GAListener />
        </Suspense>

        {children}
      </body>
    </html>
  );
}
