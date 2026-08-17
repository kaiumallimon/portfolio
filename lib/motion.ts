"use client";

import { useMotionValue, useSpring, useTransform } from "framer-motion";
import React, { useRef } from "react";

// ============================================================================
// Physics Spring Presets
// ============================================================================
export const springs = {
  // Ultra-responsive, minimal overshoot (buttons, quick interactions)
  snappy: { type: "spring", stiffness: 450, damping: 28, mass: 0.8 },
  // Soft, smooth, cinematic feel (section entries, large cards)
  gentle: { type: "spring", stiffness: 120, damping: 18, mass: 1 },
  // Playful, noticeable bounce (badges, status dots, celebratory alerts)
  bouncy: { type: "spring", stiffness: 320, damping: 14, mass: 0.9 },
  // Elastic magnetic pull for buttons and icons
  magnetic: { type: "spring", stiffness: 220, damping: 16, mass: 0.5 },
  // Slow weighted momentum for parallax / inertia tilts
  slow: { type: "spring", stiffness: 75, damping: 20, mass: 1.2 },
} as const;

// ============================================================================
// Motion Variants with Physics Springs
// ============================================================================
export const physicsFadeUp = {
  hidden: { opacity: 0, y: 32, scale: 0.98 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      ...springs.gentle,
      delay,
    },
  }),
};

export const physicsPopIn = {
  hidden: { opacity: 0, scale: 0.8, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      ...springs.bouncy,
      delay,
    },
  }),
};

export const physicsStaggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const physicsStaggerItem = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springs.gentle,
  },
};

// ============================================================================
// Physics Hooks
// ============================================================================

/**
 * useMagnetic Hook
 * Provides magnetic attraction toward cursor on hover with realistic spring release.
 */
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
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;
    rawX.set(deltaX);
    rawY.set(deltaY);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return { ref, x, y, handleMouseMove, handleMouseLeave };
}

/**
 * use3DTilt Hook
 * Computes realistic 3D perspective tilt angles and spring-damped return.
 */
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

    const rotX = ((y - centerY) / centerY) * -maxTilt;
    const rotY = ((x - centerX) / centerX) * maxTilt;

    rawRotateX.set(rotX);
    rawRotateY.set(rotY);
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
