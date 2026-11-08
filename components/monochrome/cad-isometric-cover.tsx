"use client";

import React, { useId, useRef, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const METAL_CLICK_DATA_URI =
  "data:audio/mpeg;base64,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";

const springTransition = {
  type: "spring",
  mass: 0.5,
  damping: 18,
  stiffness: 220,
} as const;

export function CadIsometricCover() {
  const uid = useId().replace(/:/g, "_");
  const gridPatternId = `cad-grid-pattern-${uid}`;
  const facePatternId = `cad-face-pattern-${uid}`;
  const faceFillId = `cad-face-fill-${uid}`;
  const strokeId = `cad-stroke-${uid}`;
  const radialGradientId = `cad-radial-gradient-${uid}`;

  const svgRef = useRef<SVGSVGElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const rawMouseX = useMotionValue(0.5);
  const rawMouseY = useMotionValue(0.5);

  const springCx = useSpring(
    useTransform(rawMouseX, [0, 1], [0, 556]),
    { stiffness: 300, damping: 30, mass: 0.1 }
  );
  const springCy = useSpring(
    useTransform(rawMouseY, [0, 1], [0, 354]),
    { stiffness: 300, damping: 30, mass: 0.1 }
  );

  const playClickSound = useCallback(() => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(METAL_CLICK_DATA_URI);
        audioRef.current.volume = 0.5;
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    } catch {}
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const nx = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const ny = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
        rawMouseX.set(nx);
        rawMouseY.set(ny);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [rawMouseX, rawMouseY]);

  return (
    <figure className="relative w-full max-w-full select-none">
      <motion.svg
        ref={svgRef}
        className="h-auto w-full touch-manipulation overflow-visible cursor-pointer"
        viewBox="0 0 556 354"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        initial="normal"
        whileTap="pressed"
        onTap={playClickSound}
      >
        <defs>
          {/* Subtle Fine CAD Grid Background */}
          <pattern
            id={gridPatternId}
            width="14"
            height="14"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 14 0 L 0 0 0 14"
              fill="none"
              stroke="currentColor"
              className="text-zinc-200/40 dark:text-zinc-800/40"
              strokeWidth="0.5"
            />
          </pattern>

          {/* Diagonal 30° CAD Hatching Pattern */}
          <pattern
            id={facePatternId}
            x="0"
            y="0"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M-1 1l2 -2M0 10l10 -10M9 11l2 -2"
              stroke="currentColor"
              className="text-zinc-300 dark:text-zinc-800"
              strokeWidth="1"
            />
          </pattern>

          {/* Top Faces of K, A, L */}
          <g id={faceFillId}>
            {/* Letter K */}
            <path d="M111.29 103.94L141.6 121.44L232.53 68.94L202.22 51.44Z" />
            <path d="M194.65 90.81L240.11 117.06L278 95.19L232.53 68.94Z" />
            <path d="M141.6 121.44L187.07 147.69L224.96 125.81L179.49 99.56Z" />

            {/* Letter A */}
            <path d="M209.8 160.81L240.11 178.31L331.04 125.81L300.73 108.31Z" />
            <path d="M270.42 195.81L300.73 213.31L391.67 160.81L361.35 143.31Z" />
            <path d="M308.31 138.94L338.62 156.44L361.35 143.31L331.04 125.81Z" />
            <path d="M270.42 160.81L300.73 178.31L323.47 165.19L293.16 147.69Z" />

            {/* Letter L */}
            <path d="M323.47 226.44L353.78 243.94L444.71 191.44L414.4 173.94Z" />
            <path d="M353.78 243.94L406.82 274.56L437.13 257.06L384.09 226.44Z" />
          </g>

          {/* Perimeter Stroke Lines for K, A, L */}
          <path
            id={strokeId}
            d="M111.29 103.94L141.6 121.44L232.53 68.94L202.22 51.44Z M111.29 103.94L111.29 131.94 M141.6 121.44L141.6 149.44 M111.29 131.94L141.6 149.44 M232.53 68.94L232.53 96.94 M141.6 149.44L232.53 96.94 M194.65 90.81L240.11 117.06L278 95.19L232.53 68.94Z M194.65 90.81L194.65 118.81 M240.11 117.06L240.11 145.06 M194.65 118.81L240.11 145.06 M278 95.19L278 123.19 M240.11 145.06L278 123.19 M141.6 121.44L187.07 147.69L224.96 125.81L179.49 99.56Z M187.07 147.69L187.07 175.69 M141.6 149.44L187.07 175.69 M224.96 125.81L224.96 153.81 M187.07 175.69L224.96 153.81 M209.8 160.81L240.11 178.31L331.04 125.81L300.73 108.31Z M209.8 160.81L209.8 188.81 M240.11 178.31L240.11 206.31 M209.8 188.81L240.11 206.31 M331.04 125.81L331.04 153.81 M240.11 206.31L331.04 153.81 M270.42 195.81L300.73 213.31L391.67 160.81L361.35 143.31Z M270.42 195.81L270.42 223.81 M300.73 213.31L300.73 241.31 M270.42 223.81L300.73 241.31 M391.67 160.81L391.67 188.81 M300.73 241.31L391.67 188.81 M308.31 138.94L338.62 156.44L361.35 143.31L331.04 125.81Z M308.31 138.94L308.31 166.94 M338.62 156.44L338.62 184.44 M308.31 166.94L338.62 184.44 M361.35 143.31L361.35 171.31 M338.62 184.44L361.35 171.31 M270.42 160.81L300.73 178.31L323.47 165.19L293.16 147.69Z M270.42 160.81L270.42 188.81 M300.73 178.31L300.73 206.31 M270.42 188.81L300.73 206.31 M323.47 165.19L323.47 193.19 M300.73 206.31L323.47 193.19 M323.47 226.44L353.78 243.94L444.71 191.44L414.4 173.94Z M323.47 226.44L323.47 254.44 M353.78 243.94L353.78 271.94 M323.47 254.44L353.78 271.94 M444.71 191.44L444.71 219.44 M353.78 271.94L444.71 219.44 M353.78 243.94L406.82 274.56L437.13 257.06L384.09 226.44Z M406.82 274.56L406.82 302.56 M353.78 271.94L406.82 302.56 M437.13 257.06L437.13 285.06 M406.82 302.56L437.13 285.06"
          />

          {/* Smooth Cursor Tracking Radial Gradient */}
          <motion.radialGradient
            id={radialGradientId}
            r="200"
            gradientUnits="userSpaceOnUse"
            cx={springCx}
            cy={springCy}
          >
            <stop className="dark:[stop-color:#ffffff]" stopColor="#18181b" />
            <stop
              className="dark:[stop-color:#71717a]"
              offset="1"
              stopColor="#a1a1aa"
              stopOpacity="0"
            />
          </motion.radialGradient>
        </defs>

        {/* Background Fine CAD Grid */}
        <rect width="100%" height="100%" fill={`url(#${gridPatternId})`} />

        {/* 3 Infinite Dashed Projection Lines */}
        <g
          className="text-zinc-300/80 dark:text-zinc-800"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 2"
        >
          <path d="M-477.55 756.57L1254.51 -243.41" />
          <path d="M977.37 788.58L-754.67 -211.42" />
          <path d="M1143.65 692.58L-588.39 -307.42" />
        </g>

        {/* 3D Motion Container: sinks on click with spring animation */}
        <motion.g
          variants={{
            normal: { y: 0 },
            pressed: { y: 12 },
          }}
          transition={springTransition}
        >
          {/* Solid Side Walls (Background Matched) */}
          <g
            className="fill-white dark:fill-zinc-950"
            fillRule="evenodd"
            clipRule="evenodd"
          >
            {/* Letter K side walls */}
            <path d="M111.29 103.94L141.6 121.44L141.6 149.44L111.29 131.94Z" />
            <path d="M141.6 121.44L232.53 68.94L232.53 96.94L141.6 149.44Z" />
            <path d="M194.65 90.81L240.11 117.06L240.11 145.06L194.65 118.81Z" />
            <path d="M240.11 117.06L278 95.19L278 123.19L240.11 145.06Z" />
            <path d="M141.6 121.44L187.07 147.69L187.07 175.69L141.6 149.44Z" />
            <path d="M187.07 147.69L224.96 125.81L224.96 153.81L187.07 175.69Z" />

            {/* Letter A side walls */}
            <path d="M209.8 160.81L240.11 178.31L240.11 206.31L209.8 188.81Z" />
            <path d="M240.11 178.31L331.04 125.81L331.04 153.81L240.11 206.31Z" />
            <path d="M270.42 195.81L300.73 213.31L300.73 241.31L270.42 223.81Z" />
            <path d="M300.73 213.31L391.67 160.81L391.67 188.81L300.73 241.31Z" />
            <path d="M308.31 138.94L338.62 156.44L338.62 184.44L308.31 166.94Z" />
            <path d="M338.62 156.44L361.35 143.31L361.35 171.31L338.62 184.44Z" />
            <path d="M270.42 160.81L300.73 178.31L300.73 206.31L270.42 188.81Z" />
            <path d="M300.73 178.31L323.47 165.19L323.47 193.19L300.73 206.31Z" />

            {/* Letter L side walls */}
            <path d="M323.47 226.44L353.78 243.94L353.78 271.94L323.47 254.44Z" />
            <path d="M353.78 243.94L444.71 191.44L444.71 219.44L353.78 271.94Z" />
            <path d="M353.78 243.94L406.82 274.56L406.82 302.56L353.78 271.94Z" />
            <path d="M406.82 274.56L437.13 257.06L437.13 285.06L406.82 302.56Z" />
          </g>

          {/* Render Top Faces of K, A, L */}
          <use href={`#${faceFillId}`} className="fill-white dark:fill-zinc-950" />
          <use href={`#${faceFillId}`} fill={`url(#${facePatternId})`} />

          {/* Render Perimeter Borders: Subtle base line + dynamic radial gradient highlight */}
          <use
            href={`#${strokeId}`}
            stroke="currentColor"
            className="text-zinc-300 dark:text-zinc-800"
            strokeWidth="1"
          />
          <use
            href={`#${strokeId}`}
            stroke={`url(#${radialGradientId})`}
            strokeWidth="1.5"
          />
        </motion.g>

        {/* 30° Dimension Arc Guide */}
        <g
          className="pointer-events-none text-zinc-400 dark:text-zinc-600 max-sm:hidden"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinejoin="round"
        >
          <path d="M443.9 0.58H543.9" />
          <path d="M531.9 0.58A88 88 0 0 1 520.11 44.58" />
          <path
            className="fill-white dark:fill-zinc-950"
            d="M0 0 8-3v6Z"
            transform="translate(531.9 0.58) rotate(90)"
          />
          <path
            className="fill-white dark:fill-zinc-950"
            d="M0 0 8-3v6Z"
            transform="translate(520.11 44.58) rotate(-60)"
          />
          <text
            className="fill-zinc-400 dark:fill-zinc-500 font-mono select-none"
            x="546.29"
            y="28.01"
            stroke="none"
            fontSize="12"
            textAnchor="middle"
            dominantBaseline="central"
          >
            30°
          </text>
        </g>
      </motion.svg>

      {/* Handwritten Hint: "follows your cursor / click for a sound" */}
      <div
        className="pointer-events-none absolute select-none bottom-8 -right-2 sm:bottom-12 sm:right-2 md:-right-6 flex flex-col items-start font-mono text-[11px] text-zinc-400 dark:text-zinc-500"
        aria-hidden="true"
      >
        <svg
          className="size-7 shrink-0 text-zinc-400 dark:text-zinc-600 -scale-y-100 -rotate-6"
          viewBox="0 0 40 40"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M34 4c1 15-5 26-21 30" />
          <path d="m22 37-9-3 7.5-8" />
        </svg>
        <span className="ml-2 -rotate-6 italic leading-tight">
          follows your cursor
          <span className="block text-[10px] text-zinc-400/80">click for a sound</span>
        </span>
      </div>
    </figure>
  );
}
