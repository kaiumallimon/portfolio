import { Variants } from "framer-motion";

// Animation duration constants for consistency
export const ANIMATION_DURATION = {
  fast: 0.3,
  medium: 0.6,
  slow: 0.8,
  verySlow: 1.2,
} as const;

// Animation delay constants for staggered effects
export const ANIMATION_DELAY = {
  none: 0,
  short: 0.1,
  medium: 0.2,
  long: 0.3,
  veryLong: 0.4,
} as const;

// Animation easing curves
export const ANIMATION_EASING = {
  smooth: [0.25, 0.46, 0.45, 0.94],
  bouncy: [0.68, -0.55, 0.265, 1.55],
  sharp: [0.4, 0, 0.6, 1],
  gentle: [0.25, 0.1, 0.25, 1],
} as const;

// Common animation variants
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATION.medium,
      delay,
      ease: ANIMATION_EASING.smooth,
    },
  }),
};

export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -40,
  },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATION.medium,
      delay,
      ease: ANIMATION_EASING.smooth,
    },
  }),
};

export const fadeInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -40,
  },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: ANIMATION_DURATION.medium,
      delay,
      ease: ANIMATION_EASING.smooth,
    },
  }),
};

export const fadeInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 40,
  },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: ANIMATION_DURATION.medium,
      delay,
      ease: ANIMATION_EASING.smooth,
    },
  }),
};

export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: ANIMATION_DURATION.medium,
      delay,
      ease: ANIMATION_EASING.bouncy,
    },
  }),
};

export const slideInUp: Variants = {
  hidden: {
    y: "100%",
    opacity: 0,
  },
  visible: (delay = 0) => ({
    y: "0%",
    opacity: 1,
    transition: {
      duration: ANIMATION_DURATION.slow,
      delay,
      ease: ANIMATION_EASING.smooth,
    },
  }),
};

// Stagger container variant for multiple children
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: ANIMATION_DELAY.short,
      delayChildren: ANIMATION_DELAY.medium,
    },
  },
};

// Hover animations
export const hoverScale = {
  scale: 1.05,
  transition: {
    duration: ANIMATION_DURATION.fast,
    ease: ANIMATION_EASING.smooth,
  },
};

export const hoverLift = {
  y: -5,
  transition: {
    duration: ANIMATION_DURATION.fast,
    ease: ANIMATION_EASING.smooth,
  },
};

// Scroll-triggered animation function
export const createScrollAnimation = (
  direction: "up" | "down" | "left" | "right" = "up",
  delay = 0
) => {
  const directions = {
    up: { y: 60 },
    down: { y: -60 },
    left: { x: 60 },
    right: { x: -60 },
  };

  return {
    hidden: {
      opacity: 0,
      ...directions[direction],
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: ANIMATION_DURATION.slow,
        delay,
        ease: ANIMATION_EASING.smooth,
      },
    },
  };
};

// Custom hook for scroll animations
export const useScrollAnimation = (
  direction: "up" | "down" | "left" | "right" = "up",
  delay = 0
) => {
  return createScrollAnimation(direction, delay);
};