"use client";

import React, { useEffect, useRef, useState, useMemo, useSyncExternalStore } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  animate,
  useMotionValue,
  useSpring,
  Variants,
  UseInViewOptions,
} from "framer-motion";

// ============================================================================
// Global Reveal & Motion Configuration
// ============================================================================

/**
 * Toggle whether the retro terminal boot line (> booting kal.dev ... ok)
 * displays inside the cover artwork during the initial load reveal.
 */
export const SHOW_COVER_BOOT_MESSAGE = true;

/**
 * Session storage flag to guarantee the load reveal plays only once per session.
 */
export const SESSION_REVEAL_KEY = "kal_load_reveal_played_v1";

let hasPlayedCache: boolean | null = null;
const listeners = new Set<() => void>();

export function getSessionRevealSnapshot(): boolean {
  if (typeof window === "undefined") return true;
  if (hasPlayedCache === null) {
    try {
      hasPlayedCache = sessionStorage.getItem(SESSION_REVEAL_KEY) === "1";
    } catch {
      hasPlayedCache = true;
    }
  }
  return hasPlayedCache;
}

export function hasPlayedLoadReveal(): boolean {
  return getSessionRevealSnapshot();
}

export function markLoadRevealPlayed(): void {
  hasPlayedCache = true;
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem(SESSION_REVEAL_KEY, "1");
    } catch {
      // SessionStorage may be disabled or restricted in private browsing
    }
  }
  listeners.forEach((listener) => listener());
}

const subscribeSession = (callback: () => void) => {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
};

/**
 * Reactive hook that returns whether the current render is the initial
 * load reveal of the session. Returns false on SSR (guaranteeing 100% visible
 * content with zero layout shift for crawlers and JS-disabled users) and
 * true only on initial client mount when sessionStorage flag is not yet set.
 */
export function useIsInitialReveal(): boolean {
  const shouldReduceMotion = useReducedMotion();
  const hasPlayed = useSyncExternalStore(
    subscribeSession,
    getSessionRevealSnapshot,
    () => true
  );

  return !hasPlayed && !shouldReduceMotion;
}

// ============================================================================
// Standard Easing Curves & Durations
// ============================================================================
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_SMOOTH = [0.25, 0.1, 0.25, 1] as const;

export const DURATION_FAST = 0.35;
export const DURATION_NORMAL = 0.5;
export const DURATION_SLOW = 0.8;

// ============================================================================
// Spring Physics Presets
// ============================================================================
export const springs = {
  snappy: { type: "spring", stiffness: 450, damping: 28, mass: 0.8 },
  gentle: { type: "spring", stiffness: 120, damping: 18, mass: 1 },
  bouncy: { type: "spring", stiffness: 320, damping: 14, mass: 0.9 },
  magnetic: { type: "spring", stiffness: 220, damping: 16, mass: 0.5 },
  slow: { type: "spring", stiffness: 75, damping: 20, mass: 1.2 },
} as const;

// ============================================================================
// Shared Variants
// ============================================================================
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (custom: { delay?: number; duration?: number } = {}) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: custom.duration ?? DURATION_NORMAL,
      delay: custom.delay ?? 0,
      ease: EASE_OUT,
    },
  }),
};

export const scaleXVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: (custom: { delay?: number; duration?: number } = {}) => ({
    scaleX: 1,
    transition: {
      duration: custom.duration ?? DURATION_SLOW,
      delay: custom.delay ?? 0,
      ease: EASE_OUT,
    },
  }),
};

export const scaleYVariants: Variants = {
  hidden: { scaleY: 0 },
  visible: (custom: { delay?: number; duration?: number } = {}) => ({
    scaleY: 1,
    transition: {
      duration: custom.duration ?? DURATION_SLOW,
      delay: custom.delay ?? 0,
      ease: EASE_OUT,
    },
  }),
};

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
};

// ============================================================================
// Reusable Component: Reveal
// Wraps any content block to fade up 10px once when scrolled into view.
// ============================================================================
interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  margin?: UseInViewOptions["margin"];
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  duration = DURATION_NORMAL,
  y = 10,
  margin = "-24px",
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin }}
      transition={{
        duration,
        delay,
        ease: EASE_OUT,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// Reusable Component: RevealStagger
// Container for children that stagger their reveals sequentially.
// ============================================================================
interface RevealStaggerProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  margin?: UseInViewOptions["margin"];
}

export function RevealStagger({
  children,
  className = "",
  stagger = 0.06,
  delayChildren = 0.02,
  margin = "-24px",
}: RevealStaggerProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger,
            delayChildren,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// Reusable Component: DrawLine
// Draws section divider lines or timeline tracks horizontally or vertically.
// ============================================================================
interface DrawLineProps {
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "horizontal" | "vertical";
  margin?: UseInViewOptions["margin"];
}

export function DrawLine({
  className = "",
  delay = 0,
  duration = DURATION_SLOW,
  direction = "horizontal",
  margin = "-20px",
}: DrawLineProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className} />;
  }

  const isH = direction === "horizontal";

  return (
    <motion.div
      initial={{ [isH ? "scaleX" : "scaleY"]: 0 }}
      whileInView={{ [isH ? "scaleX" : "scaleY"]: 1 }}
      viewport={{ once: true, margin }}
      transition={{
        duration,
        delay,
        ease: EASE_OUT,
      }}
      style={{
        transformOrigin: isH ? "left center" : "top center",
      }}
      className={className}
      aria-hidden="true"
    />
  );
}

// ============================================================================
// Reusable Component: CountUp
// Counts up numeric stats when visible in viewport (handles values like "3+", "22").
// ============================================================================
interface CountUpProps {
  value: string | number;
  duration?: number;
  delay?: number;
  className?: string;
}

export function CountUp({
  value,
  duration = 1.2,
  delay = 0.1,
  className = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  const shouldReduceMotion = useReducedMotion();

  // Parse string into target number, prefix, and suffix (e.g. "3+" -> 3, suffix "+")
  const { numericTarget, prefix, suffix, isNumeric } = useMemo(() => {
    const str = String(value).trim();
    const match = str.match(/^([^0-9]*)([0-9]+)([^0-9]*)$/);
    if (match) {
      return {
        prefix: match[1] || "",
        numericTarget: parseInt(match[2], 10),
        suffix: match[3] || "",
        isNumeric: true,
      };
    }
    return {
      prefix: "",
      numericTarget: 0,
      suffix: "",
      isNumeric: false,
    };
  }, [value]);

  const [currentVal, setCurrentVal] = useState<number>(shouldReduceMotion ? numericTarget : 0);

  useEffect(() => {
    if (!isNumeric || shouldReduceMotion || !inView) return;

    const controls = animate(0, numericTarget, {
      duration,
      delay,
      ease: EASE_OUT,
      onUpdate: (latest) => {
        setCurrentVal(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [inView, isNumeric, numericTarget, duration, delay, shouldReduceMotion]);

  if (!isNumeric || shouldReduceMotion) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span ref={ref} className={className}>
      {prefix}
      {currentVal.toLocaleString()}
      {suffix}
    </span>
  );
}

// ============================================================================
// Legacy Physics Hooks (Maintained for backward compatibility)
// ============================================================================
export function useMagnetic(strength = 0.35) {
  const ref = useRef<HTMLDivElement | null>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 220, damping: 16, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 220, damping: 16, mass: 0.5 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    rawX.set((e.clientX - centerX) * strength);
    rawY.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return { ref, x, y, handleMouseMove, handleMouseLeave };
}

export function use3DTilt({ maxTilt = 10, scale = 1.02 } = {}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rawScale = useMotionValue(1);

  const rotateX = useSpring(rawRotateX, { stiffness: 200, damping: 20, mass: 0.7 });
  const rotateY = useSpring(rawRotateY, { stiffness: 200, damping: 20, mass: 0.7 });
  const cardScale = useSpring(rawScale, { stiffness: 300, damping: 22 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    rawRotateX.set(((y - centerY) / centerY) * -maxTilt);
    rawRotateY.set(((x - centerX) / centerX) * maxTilt);
    rawScale.set(scale);
  };

  const handleMouseLeave = () => {
    rawRotateX.set(0);
    rawRotateY.set(0);
    rawScale.set(1);
  };

  return {
    ref,
    rotateX,
    rotateY,
    scale: cardScale,
    handleMouseMove,
    handleMouseLeave,
    style: {
      rotateX,
      rotateY,
      scale: cardScale,
      transformPerspective: 1000,
    },
  };
}
