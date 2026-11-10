"use client";

import React, { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";
import { LENIS_CONFIG } from "@/lib/motion";

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

/**
 * RouteChangeScroller
 * Ensures client-side route transitions immediately scroll to top without lag,
 * and pauses Lenis on pinned full-screen routes like /contact.
 */
function RouteChangeScroller() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) {
      window.scrollTo(0, 0);
      return;
    }

    const isPinnedRoute = pathname === "/contact" || pathname?.startsWith("/contact");
    if (isPinnedRoute) {
      lenis.stop();
    } else {
      lenis.start();
      lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname, lenis]);

  return null;
}

/**
 * SmoothScrollProvider
 * Fluid smooth scrolling provider wrapping Lenis with gentle physics (lerp: 0.1, duration: 1.1).
 * Completely bypassed when prefers-reduced-motion is set.
 */
export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  // When prefers-reduced-motion is active, disable Lenis completely
  if (reducedMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        ...LENIS_CONFIG,
      }}
    >
      <RouteChangeScroller />
      {children}
    </ReactLenis>
  );
}
