import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";


import Navbar from "@/components/custom/nav";
import Footer from "@/components/custom/footer";
import RouteSplash from "@/components/custom/route-splash";
import RouteGate from "@/components/custom/route-gate";
import SmoothScroll from "@/components/custom/smooth-scroll";
import Silk from "@/components/Silk";
import AnimatedCursor from "@/components/custom/animated-cursor";


const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
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
    <html lang="en" className="dark h-full overflow-hidden">
      <body className={`${jetbrainsMono.className} p-4 border h-full overflow-hidden`}>
        <AnimatedCursor />

        {/* main container */}
        <div className="relative w-full h-full overflow-hidden border rounded-md flex flex-col">

          {/* background layer */}
          {/* <BeamsBackground className="pointer-events-none absolute inset-0 -z-10" /> */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <Silk
              speed={5}
              scale={1}
              color="#4f4f4f"
              noiseIntensity={1.5}
              rotation={0}
            />
          </div>

          {/* Navbar */}
          <Navbar />

          <main className="relative flex-1 flex flex-col overflow-hidden scrollbar-custom">
            {/* Route transition splash (scoped to main content) */}
            <RouteSplash />
            <SmoothScroll easeDuration={0.6}>
              <RouteGate durationMs={700}>
                {children}
              </RouteGate>
            </SmoothScroll>
          </main>

          <Footer />

        </div>
      </body>
    </html>
  );

}
