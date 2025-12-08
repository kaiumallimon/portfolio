"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

type NavSlideLinkProps = {
  href: string;
  text: string;
  className?: string;
  active?: boolean;
};

export default function NavSlideLink({ href, text, className, active }: NavSlideLinkProps) {
  const rootRef = useRef<HTMLAnchorElement | null>(null);
  const topRef = useRef<HTMLSpanElement | null>(null);
  const bottomRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    const top = topRef.current;
    const bottom = bottomRef.current;
    if (!el || !top || !bottom) return;

    const enter = () => {
      gsap.to(top, { yPercent: -100, duration: 0.25, ease: "power2.out" });
      gsap.to(bottom, { yPercent: -100, duration: 0.25, ease: "power2.out" });
    };
    const leave = () => {
      gsap.to(top, { yPercent: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(bottom, { yPercent: 0, duration: 0.25, ease: "power2.out" });
    };

    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <Link
      ref={rootRef}
      href={href}
      className={
        `relative inline-flex h-10 items-center overflow-hidden px-6 transition-colors ` +
        (active ? "bg-white/20 text-white " : "text-muted-foreground ") +
        (className ?? "")
      }
    >
      <span className="relative block">
        <span ref={topRef} className="block">{text}</span>
        <span ref={bottomRef} className="absolute top-full left-0 block">{text}</span>
      </span>
    </Link>
  );
}
