"use client";

import { tiny5 } from "@/lib/fonts";

export function PixelLogo({
  className = "",
  size = "text-6xl sm:text-7xl md:text-8xl lg:text-9xl",
}: {
  className?: string;
  size?: string;
}) {
  return (
    <span
      className={`${tiny5.className} font-tiny5 ${size} tracking-[0.22em] text-zinc-950 dark:text-zinc-50 select-none uppercase inline-block font-normal transition-transform duration-200 hover:scale-[1.02]`}
      style={{
        fontFamily: "var(--font-tiny5), 'Tiny5', monospace",
        letterSpacing: "0.22em",
      }}
      aria-label="KAL pixel monogram"
    >
      KAL
    </span>
  );
}
