"use client";

import { useEffect, useCallback, useState } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    __swarmRebuild?: {
      toggle: () => void;
      start: () => void;
      stop: (reveal?: boolean) => void;
      restart: () => void;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      app: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      debug: any;
    };
    __swarmAutoStart?: boolean;
  }
}

/**
 * Global constant controlling whether the swarm rebuild animation
 * automatically runs on initial page load / refresh.
 */
export const SWARM_AUTO_START_ON_LOAD = true;

/**
 * Loads the self-contained Swarm Rebuild engine (/swarm.js) and triggers start.
 */
export function loadSwarmScript(autoStart = true): void {
  if (typeof window === "undefined") return;

  window.__swarmAutoStart = autoStart;

  const currentRebuild = window.__swarmRebuild;
  if (currentRebuild) {
    if (autoStart) {
      currentRebuild.start();
    }
    return;
  }

  const existing = document.querySelector('script[data-swarm="true"]');
  if (existing) {
    return;
  }

  const script = document.createElement("script");
  script.src = "/swarm.js";
  script.async = true;
  script.dataset.swarm = "true";
  document.body.appendChild(script);
}

/**
 * Programmatically triggers the native Swarm Rebuild on demand.
 */
export function triggerSwarmRebuild(forceRestart = false): void {
  if (typeof window === "undefined") return;

  if (window.__swarmRebuild) {
    if (forceRestart && typeof window.__swarmRebuild.restart === "function") {
      window.__swarmRebuild.restart();
    } else {
      window.__swarmRebuild.start();
    }
  } else {
    loadSwarmScript(true);
  }
}

/**
 * React hook to interact with the Swarm Rebuild engine.
 */
export function useSwarmRebuild() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkActive = () => {
      const active = Boolean(
        document.querySelector("swarm-rebuild") ||
        (window.__swarmRebuild?.app && !window.__swarmRebuild.app.dead)
      );
      setIsActive(active);
    };

    checkActive();
    const checkInterval = setInterval(checkActive, 150);

    window.addEventListener("swarm:start", checkActive);
    window.addEventListener("swarm:stop", checkActive);
    window.addEventListener("swarm:complete", checkActive);

    return () => {
      clearInterval(checkInterval);
      window.removeEventListener("swarm:start", checkActive);
      window.removeEventListener("swarm:stop", checkActive);
      window.removeEventListener("swarm:complete", checkActive);
    };
  }, []);

  const start = useCallback(() => triggerSwarmRebuild(false), []);
  const restart = useCallback(() => triggerSwarmRebuild(true), []);
  const stop = useCallback((reveal = true) => {
    if (typeof window === "undefined") return;
    window.__swarmRebuild?.stop(reveal);
  }, []);
  const toggle = useCallback(() => {
    if (typeof window === "undefined") return;
    if (window.__swarmRebuild) {
      window.__swarmRebuild.toggle();
    } else {
      loadSwarmScript(true);
    }
  }, []);

  return { isActive, start, restart, stop, toggle };
}

/**
 * Client provider component mounted in RootLayout.
 * Handles auto-start on page load, global shortcut (Alt+Shift+S), and cleanup.
 */
export function SwarmRebuildProvider() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detect if this page entry is a browser reload / refresh
    let isReload = false;
    try {
      const navEntries = performance.getEntriesByType("navigation");
      if (navEntries.length > 0) {
        isReload = (navEntries[0] as PerformanceNavigationTiming).type === "reload";
      } else if (window.performance && window.performance.navigation) {
        isReload = window.performance.navigation.type === 1;
      }
    } catch (_) {}

    const sessionKey = `swarm_done:${pathname}`;

    // If reloaded, remove session completion flag so refresh always triggers rebuild
    if (isReload) {
      try {
        sessionStorage.removeItem(sessionKey);
      } catch (_) {}
    }

    // Check if this particular page already completed swarm rebuild in this session
    let isDone = false;
    try {
      isDone = sessionStorage.getItem(sessionKey) === "true";
    } catch (_) {}

    if (isDone) {
      // Already completed for this page in this session
      return;
    }

    // Newly entered page or refreshed page: trigger swarm rebuild
    const timer = setTimeout(() => {
      triggerSwarmRebuild(true);
    }, 400);

    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + Shift + S or Option + Shift + S
      if (
        (e.altKey && e.shiftKey && (e.key === "S" || e.key === "s")) ||
        (e.metaKey && e.shiftKey && (e.key === "S" || e.key === "s"))
      ) {
        e.preventDefault();
        triggerSwarmRebuild(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return null;
}
