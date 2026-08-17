import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Suspense } from "react";

import GAListener from "@/lib/ga-listener";

import { ThemeProvider } from "@/components/theme-provider";
import SmoothScrollProvider from "@/components/providers/smooth-scroll-provider";
import { getSiteSettings } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings?.seo_title || "Kaium Al Limon | Full-Stack Developer";
  const description =
    settings?.seo_description ||
    "Personal portfolio of Kaium Al Limon, a Full-Stack Cross-Platform Mobile & Web Developer specializing in Flutter & Next.js. Computer Science student at UIU.";

  const profileImg = settings?.profile_image || "/bordered.png";

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
      "Flutter Developer",
      "Next.js Developer",
      "Mobile App Developer",
      "Web Developer",
      "Software Engineer",
      "FastAPI",
      "TypeScript",
      "Python",
      "Dart",
      "UIU",
      "United International University",
      "Bangladesh",
      "Portfolio",
    ],
    authors: [{ name: "Kaium Al Limon", url: "https://github.com/kaiumallimon" }],
    creator: "Kaium Al Limon",
    publisher: "Kaium Al Limon",
    formatDetection: {
      email: true,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: SITE_URL,
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
          url: profileImg,
          width: 800,
          height: 800,
          alt: "Kaium Al Limon — Full-Stack Developer",
        },
      ],
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
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: settings?.display_name || "Kaium Al Limon",
    url: SITE_URL,
    image: `${SITE_URL}${settings?.profile_image || "/bordered.png"}`,
    jobTitle: "Full-Stack Developer",
    worksFor: {
      "@type": "Organization",
      name: "Freelance & Open Source",
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "United International University",
    },
    sameAs: [
      settings?.github_url || "https://github.com/kaiumallimon",
      settings?.linkedin_url || "https://linkedin.com/in/kaiumallimon",
      settings?.facebook_url || "https://facebook.com/kaiumallimon",
    ].filter(Boolean),
    knowsAbout: [
      "Flutter",
      "Dart",
      "Next.js",
      "React",
      "TypeScript",
      "Python",
      "FastAPI",
      "Node.js",
      "PostgreSQL",
      "Cross-Platform Mobile Development",
    ],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Kaium Al Limon Portfolio",
    url: SITE_URL,
    author: {
      "@type": "Person",
      name: "Kaium Al Limon",
    },
  };

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>

      <body className={`${inter.className} ${inter.variable} ${bricolage.variable} ${jetbrainsMono.variable} antialiased`}>
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

        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
