"use client";

import React, { useMemo } from "react";

interface GradualBlurProps {
  position?: "top" | "bottom";
  height?: string;
  layers?: number;
  maxBlur?: number;
  opacity?: number;
  className?: string;
  tint?: string;
}

/**
 * GradualBlur (inspired by React Bits https://reactbits.dev/animations/gradual-blur)
 * Creates a physically-accurate, multi-layered progressive optical blur veil at the page perimeter.
 */
export default function GradualBlur({
  position = "top",
  height = "8rem",
  layers = 8,
  maxBlur = 32,
  opacity = 1,
  className = "",
  tint = "from-[#070712]/80 via-[#070712]/30 to-transparent",
}: GradualBlurProps) {
  const blurLayers = useMemo(() => {
    // Generate layered progressive slices with exponential blur distribution
    return Array.from({ length: layers }, (_, i) => {
      const fraction = (i + 1) / layers; // 0.125, 0.25, ..., 1.0
      // Exponential blur progression
      const blurAmount = Math.max(0.5, Math.pow(fraction, 2.2) * maxBlur);

      // Percentage coverage for this blur tier
      // Higher blurs cover the top portion; softer blurs extend deeper
      const coveragePercent = Math.round((1 - (i / layers) * 0.85) * 100);
      const featherStart = Math.max(0, coveragePercent - 35);

      const maskGradient =
        position === "top"
          ? `linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) ${featherStart}%, rgba(0, 0, 0, 0) ${coveragePercent}%)`
          : `linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) ${featherStart}%, rgba(0, 0, 0, 0) ${coveragePercent}%)`;

      return {
        id: i,
        blur: `${blurAmount.toFixed(1)}px`,
        mask: maskGradient,
      };
    });
  }, [layers, maxBlur, position]);

  return (
    <div
      aria-hidden="true"
      style={{ height, opacity }}
      className={`fixed ${
        position === "top" ? "top-0" : "bottom-0"
      } inset-x-0 pointer-events-none z-40 overflow-hidden select-none will-change-transform ${className}`}
    >
      {/* Smooth Background Tint Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${tint} pointer-events-none`}
      />

      {/* Progressive Multi-Tier Backdrop Blur Layers */}
      {blurLayers.map((layer) => (
        <div
          key={layer.id}
          style={{
            backdropFilter: `blur(${layer.blur})`,
            WebkitBackdropFilter: `blur(${layer.blur})`,
            maskImage: layer.mask,
            WebkitMaskImage: layer.mask,
          }}
          className="absolute inset-0 pointer-events-none transform-gpu"
        />
      ))}
    </div>
  );
}
