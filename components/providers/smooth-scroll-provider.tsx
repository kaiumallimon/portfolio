"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

// Register GSAP plugin safely on client
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SmoothScrollContext = createContext<Lenis | null>(null);

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Disable Lenis smooth scroll on /admin routes so native mouse wheel scrolling works on sidebars, dialogs, and tables
    if (pathname.startsWith("/admin")) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      return;
    }

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Initialize Lenis with GSAP-grade exponential easing
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Synchronize Lenis scroll events with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Add Lenis requestAnimationFrame to GSAP's central ticker for perfect synchronization
    const tickerUpdate = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerUpdate);
    gsap.ticker.lagSmoothing(0);

    // Global anchor click smooth navigation handler
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        const targetElement = document.querySelector(href);
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement as HTMLElement, {
            offset: -40,
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      gsap.ticker.remove(tickerUpdate);
      lenis.destroy();
      lenisRef.current = null;
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [pathname]);

  // On route change, scroll to top and refresh ScrollTrigger
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }
  }, [pathname]);

  return (
    <SmoothScrollContext.Provider value={lenisRef.current}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
