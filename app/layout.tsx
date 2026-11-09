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

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = `${settings?.name || "Kaium Al Limon"} — ${settings?.title || "Full-Stack & Design Engineer"}`;
  const description =
    settings?.headline ||
    "Crafting minimal interfaces, cross-platform apps, and resilient distributed services. Computer Science student at UIU.";

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
      "Flutter Developer",
      "Next.js Developer",
      "FastAPI",
      "TypeScript",
      "MongoDB",
      "UIU",
      "Software Engineer",
      "Portfolio",
    ],
    authors: [{ name: "Kaium Al Limon", url: "https://github.com/kaiumallimon" }],
    creator: "Kaium Al Limon",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: SITE_URL,
      title,
      description,
      siteName: "Kaium Al Limon Portfolio",
      images: [
        {
          url: "/bordered.png",
          width: 800,
          height: 800,
          alt: "Kaium Al Limon",
        },
      ],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      </head>

      <body
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
