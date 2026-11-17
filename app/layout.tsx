import type { Metadata } from "next";
import "@/styles/globals.css";
import Script from "next/script";
import { Suspense } from "react";
import { geistSans, geistMono, tiny5 } from "@/lib/fonts";
import { getSiteSettings } from "@/lib/data-service";
import { SITE_URL } from "@/lib/site";
import GAListener from "@/lib/ga-listener";
import ClickSpark from "@/components/ClickSpark";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { JsonLd } from "@/components/seo/json-ld";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = `${settings?.name || "Kaium Al Limon"} — ${settings?.title || "Full-Stack & Design Engineer"}`;
  const description =
    settings?.headline ||
    "Crafting minimal interfaces, cross-platform apps, and resilient distributed services. Computer Science student at UIU.";

  const ogImageUrl = `${SITE_URL}/og-image.png`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: "%s | Kaium Al Limon",
    },
    description,
    keywords: [
      "Kaium Al Limon",
      "Full-Stack Developer",
      "Design Engineer",
      "Software Engineer",
      "Flutter Developer",
      "Next.js Developer",
      "FastAPI",
      "TypeScript",
      "React",
      "MongoDB",
      "PostgreSQL",
      "Docker",
      "Distributed Systems",
      "UI/UX Design",
      "United International University",
      "UIU",
      "Dhaka Bangladesh",
      "Portfolio",
    ],
    authors: [{ name: "Kaium Al Limon", url: "https://github.com/kaiumallimon" }],
    creator: "Kaium Al Limon",
    publisher: "Kaium Al Limon",
    applicationName: "Kaium Al Limon Portfolio",
    alternates: {
      canonical: "/",
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
    openGraph: {
      type: "website",
      locale: "en_US",
      url: SITE_URL,
      title,
      description,
      siteName: "Kaium Al Limon Portfolio",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: "Kaium Al Limon — Full-Stack & Design Engineer",
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@kaiumallimon",
      creator: "@kaiumallimon",
      images: [ogImageUrl],
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/favicon.ico",
    },
    category: "technology",
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${tiny5.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        {/* Anti-flash inline script for BoardUI light/dark theme switch */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var stored = localStorage.getItem('boardui:theme');
                if (stored === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                } else {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                }
              } catch (e) {}
            `,
          }}
        />
        {/* No-JS & crawler fallback: ensures full visibility without scripts */}
        <noscript>
          <style>{`
            [style*="opacity: 0"], [style*="opacity:0"], [style*="visibility: hidden"] {
              opacity: 1 !important;
              transform: none !important;
              visibility: visible !important;
            }
          `}</style>
        </noscript>
        {/* Structured Data (JSON-LD) for Search Engines */}
        <JsonLd settings={settings} />
      </head>

      <body
        suppressHydrationWarning
        className={`${geistSans.className} font-sans antialiased bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen`}
      >
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

        <Suspense fallback={null}>
          <GAListener />
        </Suspense>

        <SmoothScrollProvider>
          <ClickSpark preset="comet">
            {children}
          </ClickSpark>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
