"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type RevealDirection = "up" | "down" | "left" | "right";

interface GSAPSectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  as?: "section" | "footer" | "main" | "div";
  direction?: RevealDirection;
  distance?: number;
  duration?: number;
  startThreshold?: string;
  delay?: number;
}

export function ScrollRevealSection({
  id,
  className,
  children,
  as: Component = "section",
  direction = "up",
  distance = 36,
  duration = 1.1,
  startThreshold = "top 88%",
  delay = 0,
}: GSAPSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Respect user's prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1 });
      return;
    }

    const xOffset = direction === "left" ? distance : direction === "right" ? -distance : 0;
    const yOffset = direction === "up" ? distance : direction === "down" ? -distance : 0;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          opacity: 0,
          x: xOffset,
          y: yOffset,
          scale: 0.98,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: startThreshold,
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [direction, distance, duration, startThreshold, delay]);

  const Tag = Component as any;

  return (
    <Tag ref={sectionRef} id={id} className={cn("will-change-transform", className)}>
      {children}
    </Tag>
  );
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  distance = 28,
  duration = 1,
  startThreshold = "top 88%",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: RevealDirection;
  distance?: number;
  duration?: number;
  startThreshold?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(el, { opacity: 1, x: 0, y: 0 });
      return;
    }

    const xOffset = direction === "left" ? distance : direction === "right" ? -distance : 0;
    const yOffset = direction === "up" ? distance : direction === "down" ? -distance : 0;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          opacity: 0,
          x: xOffset,
          y: yOffset,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: startThreshold,
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [delay, direction, distance, duration, startThreshold]);

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}

export function ScrollRevealStagger({
  children,
  className,
  stagger = 0.1,
  startThreshold = "top 88%",
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  startThreshold?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const items = el.querySelectorAll("[data-gsap-stagger-item]");
      gsap.set(items, { opacity: 1, y: 0, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const items = el.querySelectorAll("[data-gsap-stagger-item]");
      if (items.length === 0) return;

      gsap.fromTo(
        items,
        {
          opacity: 0,
          y: 30,
          scale: 0.96,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: startThreshold,
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [stagger, startThreshold]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
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
    <div data-gsap-stagger-item className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}

export const SCROLL_VIEWPORT = { once: true, margin: "-60px" } as const;