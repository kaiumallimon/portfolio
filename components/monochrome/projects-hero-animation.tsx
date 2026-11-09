"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  RiSmartphoneLine,
  RiMacbookLine,
  RiServerLine,
  RiStackLine,
  RiPulseLine,
  RiCodeSSlashLine,
  RiCheckboxCircleLine,
} from "@remixicon/react";

type ViewMode = "stack" | "blueprint" | "stream";

export function ProjectsHeroAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<ViewMode>("stack");
  const [activeLayer, setActiveLayer] = useState<number | null>(null);
  const [activePin, setActivePin] = useState<number>(0);
  const [isHovered, setIsHovered] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  // Mouse tilt physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-9, 9]), springConfig);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
    setCoords({
      x: Math.round((e.clientX - rect.left)),
      y: Math.round((e.clientY - rect.top)),
    });
  }, [mouseX, mouseY]);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
    setActiveLayer(null);
  };

  const layers = [
    {
      id: 0,
      title: "Client Application",
      tag: "Flutter / iOS / React",
      icon: RiSmartphoneLine,
      specs: "Native ARM64 · 60fps · Offline Cache",
      color: "zinc-900 dark:zinc-100",
      accent: "bg-emerald-500",
    },
    {
      id: 1,
      title: "Web Edge & Interface",
      tag: "Next.js / TypeScript",
      icon: RiMacbookLine,
      specs: "SSR / ISR · Server Actions · Tailwind",
      color: "zinc-900 dark:zinc-100",
      accent: "bg-sky-500",
    },
    {
      id: 2,
      title: "Backend & Systems",
      tag: "Node / MongoDB / APIs",
      icon: RiServerLine,
      specs: "REST / GraphQL · Distributed State",
      color: "zinc-900 dark:zinc-100",
      accent: "bg-purple-500",
    },
  ];

  const blueprintPins = [
    {
      id: 0,
      label: "View Engine",
      value: "Zero-Latency UI",
      desc: "Declarative reactive tree with sub-millisecond layout passes.",
      top: "28%",
      left: "30%",
    },
    {
      id: 1,
      label: "State Bus",
      value: "Deterministic BLoC",
      desc: "Isolated state mutations with event logging & replay capability.",
      top: "48%",
      left: "68%",
    },
    {
      id: 2,
      label: "Network Edge",
      value: "HTTP/2 + Cache",
      desc: "Optimistic updates with background reconciliation & offline sync.",
      top: "72%",
      left: "40%",
    },
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[270px] sm:h-[300px] select-none rounded-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/70 p-3 flex flex-col justify-between overflow-hidden shadow-xs [perspective:1000px] group"
    >
      {/* Background blueprint grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60 dark:opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
          color: "rgba(161, 161, 170, 0.12)",
        }}
      />

      {/* Dynamic Cursor Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(240px circle at ${coords.x}px ${coords.y}px, rgba(161, 161, 170, 0.08), transparent 80%)`,
        }}
      />

      {/* Crosshair accents on corners */}
      <div className="absolute top-1 left-1 text-[9px] font-mono text-zinc-300 dark:text-zinc-700 pointer-events-none">+</div>
      <div className="absolute top-1 right-1 text-[9px] font-mono text-zinc-300 dark:text-zinc-700 pointer-events-none">+</div>
      <div className="absolute bottom-1 left-1 text-[9px] font-mono text-zinc-300 dark:text-zinc-700 pointer-events-none">+</div>
      <div className="absolute bottom-1 right-1 text-[9px] font-mono text-zinc-300 dark:text-zinc-700 pointer-events-none">+</div>

      {/* Console Top Header */}
      <div className="relative z-10 flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-900">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold">
            Sys.Architecture // 0x4B
          </span>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1 bg-zinc-100/80 dark:bg-zinc-900/80 p-0.5 rounded-xs border border-zinc-200/80 dark:border-zinc-800/80 text-[10px] font-mono">
          <button
            type="button"
            onClick={() => setMode("stack")}
            className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
              mode === "stack"
                ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 font-medium shadow-2xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            Stack
          </button>
          <button
            type="button"
            onClick={() => setMode("blueprint")}
            className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
              mode === "blueprint"
                ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 font-medium shadow-2xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            Wireframe
          </button>
          <button
            type="button"
            onClick={() => setMode("stream")}
            className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
              mode === "stream"
                ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 font-medium shadow-2xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            Pipeline
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <motion.div
        className="relative z-10 flex-1 flex items-center justify-center my-1"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        <AnimatePresence mode="wait">
          {mode === "stack" && (
            <motion.div
              key="stack"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-[340px] flex flex-col gap-2 py-1"
            >
              {layers.map((layer) => {
                const isSelected = activeLayer === layer.id;
                const Icon = layer.icon;

                return (
                  <motion.div
                    key={layer.id}
                    onMouseEnter={() => setActiveLayer(layer.id)}
                    className={`relative p-2.5 rounded-xs border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-900/90 shadow-sm translate-x-1"
                        : "border-zinc-200/90 dark:border-zinc-800/90 bg-white/70 dark:bg-zinc-900/40 hover:border-zinc-400 dark:hover:border-zinc-600"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-xs flex items-center justify-center border ${
                            isSelected
                              ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950"
                              : "border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 font-sans leading-none">
                            {layer.title}
                          </div>
                          <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 mt-1">
                            {layer.tag}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-xs border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
                          {isSelected ? "ACTIVE" : `L-0${layer.id + 1}`}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-2 pt-1.5 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[10px] font-mono text-zinc-600 dark:text-zinc-300"
                      >
                        <span>{layer.specs}</span>
                        <RiCheckboxCircleLine className="w-3.5 h-3.5 text-emerald-500" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {mode === "blueprint" && (
            <motion.div
              key="blueprint"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-[340px] h-[170px] rounded-xs border border-zinc-200/90 dark:border-zinc-800/90 bg-zinc-50/50 dark:bg-zinc-900/30 p-3 flex flex-col justify-between"
            >
              {/* Measurement lines */}
              <div className="absolute top-1.5 left-2 font-mono text-[9px] text-zinc-400">
                W: 390px · H: 844px
              </div>
              <div className="absolute top-1.5 right-2 font-mono text-[9px] text-zinc-400">
                DP: 3.0x
              </div>

              {/* Wireframe Mock Outline */}
              <div className="relative w-full h-full border border-dashed border-zinc-300 dark:border-zinc-700/80 rounded-xs flex flex-col items-center justify-center p-2">
                {/* SVG vector circuit lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                  <line x1="20%" y1="30%" x2="70%" y2="50%" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" className="text-zinc-400 dark:text-zinc-600" />
                  <line x1="70%" y1="50%" x2="40%" y2="75%" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" className="text-zinc-400 dark:text-zinc-600" />
                </svg>

                {/* Hotspot Pins */}
                {blueprintPins.map((pin) => {
                  const isCurrent = activePin === pin.id;
                  return (
                    <button
                      key={pin.id}
                      type="button"
                      onClick={() => setActivePin(pin.id)}
                      onMouseEnter={() => setActivePin(pin.id)}
                      style={{ top: pin.top, left: pin.left }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 group/pin cursor-pointer"
                      title={pin.label}
                    >
                      <span className={`relative flex h-4 w-4 items-center justify-center rounded-full transition-transform ${isCurrent ? "scale-110" : "scale-90 opacity-70 group-hover/pin:scale-100 group-hover/pin:opacity-100"}`}>
                        <span className={`absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping ${isCurrent ? "bg-zinc-900 dark:bg-zinc-100" : "bg-zinc-400"}`} />
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${isCurrent ? "bg-zinc-950 dark:bg-zinc-50" : "bg-zinc-400 dark:bg-zinc-600"}`} />
                      </span>
                    </button>
                  );
                })}

                {/* Pin Details Box */}
                <div className="relative z-10 w-full max-w-[280px] p-2 bg-white/95 dark:bg-zinc-950/95 border border-zinc-200 dark:border-zinc-800 rounded-xs shadow-xs text-left">
                  <div className="flex items-center justify-between text-[10px] font-mono border-b border-zinc-100 dark:border-zinc-900 pb-1 mb-1">
                    <span className="text-zinc-400 font-semibold uppercase">{blueprintPins[activePin].label}</span>
                    <span className="text-emerald-500 font-medium">{blueprintPins[activePin].value}</span>
                  </div>
                  <p className="text-[10px] font-sans text-zinc-600 dark:text-zinc-400 leading-tight">
                    {blueprintPins[activePin].desc}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {mode === "stream" && (
            <motion.div
              key="stream"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-[340px] h-[170px] rounded-xs border border-zinc-200/90 dark:border-zinc-800/90 bg-zinc-50/50 dark:bg-zinc-900/30 p-3 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pb-1 border-b border-zinc-200/60 dark:border-zinc-800/60">
                <span>ASYNC PIPELINE</span>
                <span className="text-emerald-500">RTT: 12ms</span>
              </div>

              {/* Interactive pipeline nodes */}
              <div className="grid grid-cols-3 gap-2 my-auto items-center">
                {/* Node 1 */}
                <div className="p-2 rounded-xs border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center">
                  <RiSmartphoneLine className="w-4 h-4 mx-auto text-zinc-700 dark:text-zinc-300" />
                  <div className="text-[9px] font-mono mt-1 text-zinc-900 dark:text-zinc-100 font-medium">CLIENT</div>
                  <div className="text-[8px] font-mono text-zinc-400">DISPATCH</div>
                </div>

                {/* Connecting arrow with pulse */}
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-full h-0.5 bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 w-3 bg-zinc-950 dark:bg-zinc-100"
                      animate={{ left: ["-20%", "100%"] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                  <span className="text-[8px] font-mono text-zinc-400 mt-1">HTTPS / 2</span>
                </div>

                {/* Node 2 */}
                <div className="p-2 rounded-xs border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center">
                  <RiServerLine className="w-4 h-4 mx-auto text-zinc-700 dark:text-zinc-300" />
                  <div className="text-[9px] font-mono mt-1 text-zinc-900 dark:text-zinc-100 font-medium">SERVER</div>
                  <div className="text-[8px] font-mono text-zinc-400">OPTIMIZED</div>
                </div>
              </div>

              {/* Stream telemetry status */}
              <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 pt-1 border-t border-zinc-200/60 dark:border-zinc-800/60">
                <span className="flex items-center gap-1">
                  <RiPulseLine className="w-3 h-3 text-emerald-500 animate-spin" />
                  POLLING: ACTIVE
                </span>
                <span>PACKETS: 142/s</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Monospace HUD Footer Bar */}
      <div className="relative z-10 flex items-center justify-between pt-1.5 border-t border-zinc-100 dark:border-zinc-900 text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
        <div className="flex items-center gap-2">
          <span>X: {coords.x.toString().padStart(3, "0")}</span>
          <span>Y: {coords.y.toString().padStart(3, "0")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <RiCodeSSlashLine className="w-3 h-3 text-zinc-400" />
          <span className="text-zinc-600 dark:text-zinc-400 uppercase">
            {isHovered ? "PARALLAX ACTIVE" : "TILT ON HOVER"}
          </span>
        </div>
      </div>
    </div>
  );
}
