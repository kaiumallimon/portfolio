'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export const SCROLL_VIEWPORT = { once: true, margin: '-80px' } as const;
export const SCROLL_EASE = [0.22, 1, 0.36, 1] as const;

export const scrollTransition = (delay = 0) => ({
  duration: 0.65,
  ease: SCROLL_EASE,
  delay,
});

type ScrollRevealSectionProps = {
  id?: string;
  className?: string;
  children: React.ReactNode;
  as?: 'section' | 'footer' | 'main' | 'div';
};

export function ScrollRevealSection({
  id,
  className,
  children,
  as = 'section',
}: ScrollRevealSectionProps) {
  const Component = motion[as];

  return (
    <Component
      id={id}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={SCROLL_VIEWPORT}
      transition={scrollTransition()}
      className={className}
    >
      {children}
    </Component>
  );
}

type ScrollRevealProps = HTMLMotionProps<'div'> & {
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
};

const directionOffset = {
  up: { x: 0, y: 28 },
  down: { x: 0, y: -28 },
  left: { x: 28, y: 0 },
  right: { x: -28, y: 0 },
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  ...props
}: ScrollRevealProps) {
  const offset = directionOffset[direction];

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={SCROLL_VIEWPORT}
      transition={scrollTransition(delay)}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: SCROLL_EASE,
    },
  },
};

export function ScrollRevealStagger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={SCROLL_VIEWPORT}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScrollRevealStaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}
