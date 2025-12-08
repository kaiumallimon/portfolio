"use client";

import { ReactNode, useEffect, useRef } from "react";
import { gsap } from "gsap";

type SmoothScrollProps = {
  children: ReactNode;
  /** Higher = more delayed/inertial scroll */
  easeDuration?: number; // seconds
};

/**
 * Intercepts wheel events and animates container scrollTop
 * to create a delayed/inertial scroll feeling.
 */
export default function SmoothScroll({ children, easeDuration = 0.6 }: SmoothScrollProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef<number>(0);
  const startYRef = useRef<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    targetRef.current = el.scrollTop;

    const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

    const onWheel = (e: WheelEvent) => {
      // Only act when the event originates within the container
      // and the container is scrollable.
      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll <= 0) return; // nothing to scroll

      // Prevent default jumpy scrolling
      e.preventDefault();

      // Calculate new target position and clamp
      targetRef.current = clamp(targetRef.current + e.deltaY, 0, maxScroll);

      // Animate towards target scrollTop
      gsap.to(el, {
        scrollTop: targetRef.current,
        duration: easeDuration,
        ease: "power2.out",
      });
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll <= 0) return;

      let delta = 0;
      const page = el.clientHeight * 0.85;
      switch (e.key) {
        case "ArrowDown":
          delta = 60;
          break;
        case "ArrowUp":
          delta = -60;
          break;
        case "PageDown":
          delta = page;
          break;
        case "PageUp":
          delta = -page;
          break;
        case "Home":
          targetRef.current = 0;
          break;
        case "End":
          targetRef.current = maxScroll;
          break;
        default:
          return;
      }
      e.preventDefault();
      if (delta !== 0) targetRef.current = clamp(targetRef.current + delta, 0, maxScroll);
      gsap.to(el, { scrollTop: targetRef.current, duration: easeDuration, ease: "power2.out" });
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      startYRef.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll <= 0 || startYRef.current === null) return;
      const currentY = e.touches[0].clientY;
      const deltaY = startYRef.current - currentY; // swipe up -> positive delta
      startYRef.current = currentY;
      e.preventDefault();
      targetRef.current = clamp(targetRef.current + deltaY, 0, maxScroll);
      gsap.to(el, { scrollTop: targetRef.current, duration: easeDuration, ease: "power2.out" });
    };

    // Use passive: false to allow preventDefault
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown, { passive: false });

    return () => {
      el.removeEventListener("wheel", onWheel as EventListener);
      el.removeEventListener("touchstart", onTouchStart as EventListener);
      el.removeEventListener("touchmove", onTouchMove as EventListener);
      window.removeEventListener("keydown", onKeyDown as EventListener);
      gsap.killTweensOf(el);
    };
  }, [easeDuration]);

  return (
    <div ref={containerRef} className="h-full overflow-y-auto overscroll-contain">
      {children}
    </div>
  );
}
