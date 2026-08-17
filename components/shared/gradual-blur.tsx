"use client";

import { useMemo } from "react";

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
 * Creates a physically-accurate, multi-layered exponential optical blur veil.
 */
export default function GradualBlur({
  position = "top",
  height = "6.5rem",
  layers = 7,
  maxBlur = 28,
  opacity = 1,
  className = "",
  tint = "from-slate-950/40 to-transparent",
}: GradualBlurProps) {
  const blurLayers = useMemo(() => {
    return Array.from({ length: layers }, (_, i) => {
      // Exponential blur progression
      const step = i / (layers - 1);
      const blurAmount = Math.max(0.5, Math.pow(step, 2) * maxBlur);
      
      // Calculate mask boundary for progressive gradient
      const fadeStart = position === "top" ? 0 : Math.round((1 - step) * 60);
      const fadeEnd = position === "top" ? Math.max(10, Math.round((1 - Math.pow(step, 1.4)) * 100)) : 100;

      const maskGradient =
        position === "top"
          ? `linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) ${Math.round(
              (1 - step) * 15
            )}%, rgba(0, 0, 0, 0) ${fadeEnd}%)`
          : `linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) ${Math.round(
              (1 - step) * 15
            )}%, rgba(0, 0, 0, 0) ${fadeEnd}%)`;

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
      } inset-x-0 pointer-events-none z-40 overflow-hidden ${className}`}
    >
      {/* Background tint overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${tint} pointer-events-none`}
      />

      {/* Multi-layered progressive backdrop filters */}
      {blurLayers.map((layer) => (
        <div
          key={layer.id}
          style={{
            backdropFilter: `blur(${layer.blur})`,
            WebkitBackdropFilter: `blur(${layer.blur})`,
            maskImage: layer.mask,
            WebkitMaskImage: layer.mask,
          }}
          className="absolute inset-0 pointer-events-none"
        />
      ))}
    </div>
  );
}
