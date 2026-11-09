"use client";

import React, { useMemo, useState, useEffect, useRef, useSyncExternalStore } from "react";
import { IProject } from "@/lib/models";
import {
  buildConstellationGraph,
  ConstellationNode,
  CONSTELLATION_CONFIG,
} from "@/lib/project-constellation-graph";

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

interface ProjectConstellationProps {
  projects: Partial<IProject>[];
  hoveredSlug: string | null;
  onHoverSlug: (slug: string | null) => void;
  matchingSlugs?: Set<string>;
  onSelectProject?: (slug: string) => void;
}

export function ProjectConstellation({
  projects,
  hoveredSlug,
  onHoverSlug,
  matchingSlugs,
  onSelectProject,
}: ProjectConstellationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isTabActive, setIsTabActive] = useState(true);
  const [activeTooltip, setActiveTooltip] = useState<ConstellationNode | null>(null);

  // 1. Subscribe to prefers-reduced-motion without cascading re-renders
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  // 2. Pause when tab is hidden
  useEffect(() => {
    if (typeof document === "undefined") return;
    const handleVisibilityChange = () => {
      setIsTabActive(document.visibilityState === "visible");
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // 3. Pause when off-screen via IntersectionObserver
  useEffect(() => {
    if (!containerRef.current || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const shouldAnimate = isVisible && isTabActive && !reducedMotion;

  // 4. Pure graph construction
  const graph = useMemo(() => {
    return buildConstellationGraph(projects, CONSTELLATION_CONFIG);
  }, [projects]);

  // Connected nodes map for hovered project
  const connectedNodeIds = useMemo(() => {
    if (!hoveredSlug) return new Set<string>();
    const set = new Set<string>();
    set.add(hoveredSlug);
    graph.edges.forEach((e) => {
      if (e.sourceId === hoveredSlug) set.add(e.targetId);
      if (e.targetId === hoveredSlug) set.add(e.sourceId);
    });
    return set;
  }, [hoveredSlug, graph.edges]);

  // Handle clicking a node to scroll smoothly to that project card
  const handleNodeClick = (slug: string) => {
    if (onSelectProject) {
      onSelectProject(slug);
      return;
    }
    const cardEl = document.getElementById(`project-${slug}`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: "smooth", block: "center" });
      // Brief outline flash effect
      cardEl.classList.add("ring-2", "ring-zinc-950", "dark:ring-zinc-100");
      setTimeout(() => {
        cardEl.classList.remove("ring-2", "ring-zinc-950", "dark:ring-zinc-100");
      }, 1200);
    }
  };

  const nodeSize = CONSTELLATION_CONFIG.NODE_SIZE;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="relative w-full h-[140px] sm:h-[160px] md:h-[180px] flex items-center justify-center select-none overflow-visible"
      style={{
        // Soft edge fade out gradient so graph blends naturally into the page grid
        maskImage: "radial-gradient(ellipse 95% 85% at 50% 50%, black 55%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 95% 85% at 50% 50%, black 55%, transparent 100%)",
      }}
    >
      <svg
        viewBox={`0 0 ${graph.width} ${graph.height}`}
        className="w-full h-full max-w-[420px] max-h-[200px] overflow-visible"
        shapeRendering="crispEdges"
      >
        <defs>
          <style>{`
            @keyframes constellation-pulse {
              0%, 100% { opacity: 0.35; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.15); }
            }
            .pulse-animated {
              transform-origin: center;
              animation: constellation-pulse 3s ease-in-out infinite;
            }
          `}</style>
        </defs>

        {/* 1. Connection Lines */}
        <g className="edges">
          {graph.edges.map((edge) => {
            const isConnectedToHovered =
              hoveredSlug &&
              (edge.sourceId === hoveredSlug || edge.targetId === hoveredSlug);

            const isDimmedBySearch =
              matchingSlugs &&
              (!matchingSlugs.has(edge.sourceId) || !matchingSlugs.has(edge.targetId));

            const isDimmedByHover =
              hoveredSlug && !isConnectedToHovered;

            let strokeColor = "stroke-zinc-300 dark:stroke-zinc-800";
            let opacity = 0.55;

            if (isConnectedToHovered) {
              strokeColor = "stroke-zinc-950 dark:stroke-zinc-100";
              opacity = 0.95;
            } else if (isDimmedBySearch || isDimmedByHover) {
              opacity = 0.15;
            }

            return (
              <g key={edge.id}>
                <line
                  x1={edge.x1}
                  y1={edge.y1}
                  x2={edge.x2}
                  y2={edge.y2}
                  strokeWidth="1"
                  strokeDasharray="2 3"
                  className={`${strokeColor} transition-all duration-200`}
                  style={{ opacity }}
                />

                {/* Traveling faint data pulse along selected active edges */}
                {edge.isPulseEdge && shouldAnimate && !isDimmedBySearch && (
                  <rect
                    width="3"
                    height="3"
                    x="-1.5"
                    y="-1.5"
                    className="fill-zinc-900 dark:fill-zinc-100"
                    style={{ opacity: 0.7 }}
                  >
                    <animateMotion
                      path={`M ${edge.x1} ${edge.y1} L ${edge.x2} ${edge.y2}`}
                      dur="4.5s"
                      repeatCount="indefinite"
                      begin={`${(edge.weight * 0.4) % 2}s`}
                    />
                  </rect>
                )}
              </g>
            );
          })}
        </g>

        {/* 2. Pixel Nodes */}
        <g className="nodes">
          {graph.nodes.map((node) => {
            const isHovered = hoveredSlug === node.slug;
            const isConnected = connectedNodeIds.has(node.slug);
            const isMatchingSearch = !matchingSlugs || matchingSlugs.has(node.slug);

            const isDimmed =
              !isMatchingSearch || (hoveredSlug && !isConnected);

            const currentSize = isHovered ? nodeSize + 2 : nodeSize;
            const currentHalf = currentSize / 2;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className="cursor-pointer group"
                onClick={() => handleNodeClick(node.slug)}
                onMouseEnter={() => {
                  onHoverSlug(node.slug);
                  setActiveTooltip(node);
                }}
                onMouseLeave={() => {
                  onHoverSlug(null);
                  setActiveTooltip(null);
                }}
              >
                {/* Invisible larger hit target for smooth mouse interactions */}
                <rect
                  x="-12"
                  y="-12"
                  width="24"
                  height="24"
                  fill="transparent"
                  className="cursor-pointer"
                />

                {/* Square Pixel Node */}
                <rect
                  x={-currentHalf}
                  y={-currentHalf}
                  width={currentSize}
                  height={currentSize}
                  className={`transition-all duration-200 ${
                    isHovered
                      ? "fill-zinc-950 dark:fill-zinc-50 scale-125"
                      : isConnected && hoveredSlug
                      ? "fill-zinc-800 dark:fill-zinc-200"
                      : "fill-zinc-700 dark:fill-zinc-300"
                  } ${shouldAnimate && !hoveredSlug ? "pulse-animated" : ""}`}
                  style={{
                    opacity: isDimmed ? 0.2 : isHovered ? 1 : 0.85,
                    animationDelay: `${node.pulseDelay}s`,
                  }}
                />

                {/* Micro accent corner on active hover */}
                {isHovered && (
                  <rect
                    x={-currentHalf - 2}
                    y={-currentHalf - 2}
                    width={currentSize + 4}
                    height={currentSize + 4}
                    fill="none"
                    strokeWidth="1"
                    className="stroke-zinc-950 dark:stroke-zinc-100 opacity-60"
                  />
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* 3. Tiny Monospace Title Tooltip */}
      {activeTooltip && (
        <div
          className="pointer-events-none absolute bottom-1 right-2 px-2 py-0.5 rounded-2xs border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 shadow-2xs font-mono text-[10px] text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 transition-opacity duration-150"
        >
          <span className="w-1.5 h-1.5 rounded-none bg-zinc-950 dark:bg-zinc-50" />
          <span className="font-medium truncate max-w-[200px]">{activeTooltip.title}</span>
          <span className="text-zinc-400 dark:text-zinc-500">[{activeTooltip.category}]</span>
        </div>
      )}
    </div>
  );
}
