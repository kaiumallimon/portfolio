import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Sora } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/custom/nav";
import Footer from "@/components/custom/footer";
import RouteSplash from "@/components/custom/route-splash";
import RouteGate from "@/components/custom/route-gate";
import SmoothScroll from "@/components/custom/smooth-scroll";
import Silk from "@/components/Silk";


const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Kaium Al Limon",
  description: "Personal portfolio of Kaium Al Limon, a Full-Stack Cross-Platform Mobile & Web Developer.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <html lang="en" className="dark h-full overflow-hidden">
      <body className={`${inter.className} p-4 border h-full overflow-hidden`}>

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
