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
  duration = 1.0,
  startThreshold = "top 85%",
  delay = 0,
}: GSAPSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1 });
      return;
    }

    const xOffset = direction === "left" ? distance : direction === "right" ? -distance : 0;
    const yOffset = direction === "up" ? distance : direction === "down" ? -distance : 0;

    const ctx = gsap.context(() => {
      // 1. Reveal the section shell
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

      // 2. Delayed reveal of any [data-gsap-card] or [data-gsap-item] inside this section
      const cards = el.querySelectorAll("[data-gsap-card], [data-gsap-item]");
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: 35,
            scale: 0.96,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            stagger: 0.08,
            delay: delay + 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: startThreshold,
              toggleActions: "play none none none",
              once: true,
            },
          }
        );
      }
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

/**
 * Section Header with delayed, kinetic split-word title, eyebrow, and subtitle
 */
export function GSAPSectionHeader({
  eyebrow,
  title,
  subtitle,
  className,
  align = "left",
  rightAction,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
  rightAction?: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const words = title.split(" ");

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      const eyebrowEl = el.querySelector(".gsap-eyebrow");
      const wordEls = el.querySelectorAll(".gsap-word");
      const subtitleEl = el.querySelector(".gsap-subtitle");
      const actionEl = el.querySelector(".gsap-action");

      if (eyebrowEl) {
        tl.fromTo(
          eyebrowEl,
          { opacity: 0, y: -14 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
        );
      }

      if (wordEls.length > 0) {
        tl.fromTo(
          wordEls,
          {
            yPercent: 120,
            opacity: 0,
            rotateX: 35,
            transformOrigin: "0% 50% -30",
          },
          {
            yPercent: 0,
            opacity: 1,
            rotateX: 0,
            stagger: 0.035,
            duration: 0.85,
            ease: "power4.out",
          },
          eyebrowEl ? "-=0.4" : "0"
        );
      }

      if (subtitleEl) {
        tl.fromTo(
          subtitleEl,
          { opacity: 0, y: 18, filter: "blur(4px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.75, ease: "power3.out" },
          "-=0.5"
        );
      }

      if (actionEl) {
        tl.fromTo(
          actionEl,
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" },
          "-=0.5"
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "mb-12 md:mb-14",
        align === "center" ? "text-center max-w-2xl mx-auto" : "",
        rightAction ? "flex flex-col md:flex-row md:items-end justify-between gap-6" : "",
        className
      )}
    >
      <div className={rightAction ? "" : ""}>
        {eyebrow && (
          <span className="gsap-eyebrow inline-block text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-2">
            {eyebrow}
          </span>
        )}
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2 leading-tight perspective-1000">
          {words.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden mr-2.5">
              <span className="gsap-word inline-block">{word}</span>
            </span>
          ))}
        </h2>
        {subtitle && (
          <p className="gsap-subtitle text-slate-400 text-sm md:text-base leading-relaxed max-w-xl">
            {subtitle}
          </p>
        )}
      </div>

      {rightAction && <div className="gsap-action shrink-0">{rightAction}</div>}
    </div>
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
  stagger = 0.08,
  startThreshold = "top 88%",
  delay = 0.15,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  startThreshold?: string;
  delay?: number;
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
          y: 35,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          delay,
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
  }, [stagger, startThreshold, delay]);

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