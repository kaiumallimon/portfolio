"use client";

import React, { useId, useRef, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const METAL_CLICK_DATA_URI =
  "data:audio/mpeg;base64,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";

const springTransition = {
  type: "spring",
  mass: 0.5,
  damping: 18,
  stiffness: 200,
} as const;

export function CadIsometricCover() {
  const uid = useId().replace(/:/g, "_");
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

          {/* Top Faces with Framer Motion spring sink on tap */}
          <motion.g
            id={faceFillId}
            variants={{
              normal: { y: 0 },
              pressed: { y: 16 },
            }}
            transition={springTransition}
          >
            <path d="M333.05 256.58L222.20 320.58L166.78 288.58L277.63 224.58L333.05 256.58Z" />
            <path d="M388.48 32.58L277.63 96.58L388.48 160.58L499.33 96.58L554.76 128.58L388.48 224.58L166.78 96.58L333.05 0.58L388.48 32.58Z" />
            <path d="M166.78 288.58L111.35 320.58L0.50 256.58L55.93 224.58L166.78 288.58Z" />
            <path d="M554.76 64.58L499.33 96.58L388.48 32.58L443.90 0.58L554.76 64.58Z" />
            <path d="M166.78 160.58L55.93 224.58L0.50 192.58L111.35 128.58L166.78 160.58Z" />
          </motion.g>

          {/* Perimeter Stroke with morphing on press */}
          <motion.path
            id={strokeId}
            variants={{
              normal: {
                d: "M28.21 240.58 L0.50 224.58 V192.58 L111.35 128.58 L166.78 160.58 V192.58 L83.64 240.58M166.78 160.58 L0.50 256.58 V288.58 L111.35 352.58 L166.78 320.58 L222.20 352.58 L333.05 288.58 V256.58 L277.63 224.58 L166.78 288.58 L0.50 192.58M0.50 256.58 L111.35 320.58 L166.78 288.58 L222.20 320.58 L333.05 256.58M111.35 320.58 V352.58M166.78 288.58 V320.58M222.20 320.58 V352.58M499.33 96.58 L554.76 128.58 V160.58 L388.48 256.58 L166.78 128.58 V96.58 L333.05 0.58 L499.33 96.58M166.78 96.58 L388.48 224.58 L554.76 128.58M527.04 112.58 L554.76 96.58 V64.58 L443.90 0.58 L277.63 96.58 L388.48 160.58 L554.76 64.58M305.34 112.58 L388.48 64.58 L471.62 112.58M388.48 224.58 V256.58M388.48 32.58 V64.58",
              },
              pressed: {
                d: "M42.07 248.58 L0.50 224.58 V208.58 L111.35 144.58 L166.78 176.58 V192.58 L69.78 248.58M166.78 176.58 L0.5 272.58 V288.58 L111.35 352.58 L166.78 320.58 L222.20 352.58 L333.05 288.58 V272.58 L277.63 240.58 L166.78 304.58 L0.5 208.58M0.5 272.58 L111.35 336.58 L166.78 304.58 L222.20 336.58 L333.05 272.58M111.35 336.58 V352.58M166.78 304.58 V320.58M222.20 336.58 V352.58M499.33 112.58 L554.76 144.58 V160.58 L388.48 256.58 L166.78 128.58 V112.58 L333.05 16.58 L499.33 112.58M166.78 112.58 L388.48 240.58 L554.76 144.58M513.19 120.58 L554.76 96.58 V80.58 L443.90 16.58 L277.63 112.58 L388.48 176.58 L554.76 80.58M291.48 120.58 L388.48 64.58 L485.47 120.58M388.48 240.58 V256.58M388.48 48.58 V64.58",
              },
            }}
            transition={springTransition}
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

        {/* Side Walls Solid Fill (Background Matched) */}
        <g
          className="fill-white dark:fill-zinc-950"
          fillRule="evenodd"
          clipRule="evenodd"
        >
          <motion.path
            variants={{
              normal: {
                d: "M166.78 160.58L55.93 224.58L0.50 192.58V224.58L55.93 256.58L166.78 192.58V160.58Z",
              },
              pressed: {
                d: "M166.78 176.58L55.93 240.58L0.50 208.58V224.58L55.93 256.58L166.78 192.58V176.58Z",
              },
            }}
            transition={springTransition}
          />
          <motion.path
            variants={{
              normal: {
                d: "M166.78 288.58L111.35 320.58L0.50 256.58V288.58L111.35 352.58L166.78 320.58L222.20 352.58L333.05 288.58V256.58L222.20 320.58L166.78 288.58Z",
              },
              pressed: {
                d: "M166.78 304.58L111.35 336.58L0.50 272.58V288.58L111.35 352.58L166.78 320.58L222.20 352.58L333.05 288.58V272.58L222.20 336.58L166.78 304.58Z",
              },
            }}
            transition={springTransition}
          />
          <motion.path
            variants={{
              normal: {
                d: "M388.48 224.58L166.78 96.58V128.58L388.48 256.58L554.76 160.58V128.58L388.48 224.58Z",
              },
              pressed: {
                d: "M388.48 240.58L166.78 112.58V128.58L388.48 256.58L554.76 160.58V144.58L388.48 240.58Z",
              },
            }}
            transition={springTransition}
          />
          <motion.path
            variants={{
              normal: {
                d: "M388.48 32.58L277.63 96.58V128.58L388.48 64.58L499.33 128.58L554.75 96.58V64.58L499.33 96.58L388.48 32.58Z",
              },
              pressed: {
                d: "M388.48 48.58L277.63 112.58V128.58L388.48 64.58L499.33 128.58L554.75 96.58V80.58L499.33 112.58L388.48 48.58Z",
              },
            }}
            transition={springTransition}
          />
        </g>

        {/* Render Top Faces: Background mask then diagonal hatching */}
        <use href={`#${faceFillId}`} className="fill-white dark:fill-zinc-950" />
        <use href={`#${faceFillId}`} fill={`url(#${facePatternId})`} />

        {/* Render Perimeter Borders: Base subtle outline + interactive radial glow highlight */}
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
