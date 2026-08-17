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
  startThreshold?: string;
}

/**
 * ScrollRevealSection: Orchestrates the sequential reveal:
 * 1. Eyebrow badge
 * 2. Title words
 * 3. Subtitle / description
 * 4. Main Components (cards, grids, forms, timelines, graphs) AFTER header appears
 */
export function ScrollRevealSection({
  id,
  className,
  children,
  as: Component = "section",
  startThreshold = "top 85%",
}: GSAPSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: startThreshold,
          toggleActions: "play none none none",
          once: true,
        },
      });

      const eyebrow = el.querySelector(".gsap-eyebrow");
      const words = el.querySelectorAll(".gsap-word");
      const subtitle = el.querySelector(".gsap-subtitle");
      const action = el.querySelector(".gsap-action");
      const mainItems = el.querySelectorAll("[data-gsap-card], [data-gsap-main], [data-gsap-stagger-item]");

      // 1. Eyebrow badge (if present)
      if (eyebrow) {
        tl.fromTo(
          eyebrow,
          { opacity: 0, y: -16 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
        );
      }

      // 2. Split-word headline reveal
      if (words.length > 0) {
        tl.fromTo(
          words,
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
            duration: 0.75,
            ease: "power4.out",
          },
          eyebrow ? "-=0.3" : "0"
        );
      }

      // 3. Subtitle appears AFTER the title
      if (subtitle) {
        tl.fromTo(
          subtitle,
          { opacity: 0, y: 16, filter: "blur(4px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.65, ease: "power3.out" },
          "-=0.2"
        );
      }

      // Right action link/button (if present)
      if (action) {
        tl.fromTo(
          action,
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: 0.55, ease: "power3.out" },
          "<"
        );
      }

      // 4. Main component cards/grids/timelines render strictly AFTER title & subtitle
      if (mainItems.length > 0) {
        tl.fromTo(
          mainItems,
          {
            opacity: 0,
            y: 35,
            scale: 0.96,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.08,
            duration: 0.85,
            ease: "power3.out",
          },
          "+=0.08"
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [startThreshold]);

  const Tag = Component as any;

  return (
    <Tag ref={sectionRef} id={id} className={cn("will-change-transform", className)}>
      {children}
    </Tag>
  );
}

/**
 * Section Header with kinetic split-word title, eyebrow, and subtitle
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
  const words = title.split(" ");

  return (
    <div
      className={cn(
        "mb-12 md:mb-14",
        align === "center" ? "text-center max-w-2xl mx-auto" : "",
        rightAction ? "flex flex-col md:flex-row md:items-end justify-between gap-6" : "",
        className
      )}
    >
      <div>
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
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div data-gsap-main className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}

export function ScrollRevealStagger({
  children,
  className,
  delay,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div className={className}>
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