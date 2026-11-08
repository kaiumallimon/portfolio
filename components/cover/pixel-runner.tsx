"use client";

import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
import { Volume2, VolumeX, RotateCcw } from "lucide-react";
import { usePixelRunner, GameMode } from "./use-pixel-runner";
import { ThemeMode } from "./sprites";

interface PixelRunnerProps {
  onGameModeChange?: (mode: GameMode) => void;
}

interface ClampedSpeechBubbleProps {
  text: string;
  charX: number;
  charY: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

function ClampedSpeechBubble({
  text,
  charX,
  charY,
  containerRef,
}: ClampedSpeechBubbleProps) {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{
    left: number;
    top: number;
    arrowLeft: number;
  } | null>(null);

  useLayoutEffect(() => {
    const bubble = bubbleRef.current;
    const container = containerRef.current;
    if (!bubble || !container) return;

    const reposition = () => {
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width || container.clientWidth || 320;
      const bubbleWidth = bubble.offsetWidth || 140;
      const charPixelX = charX * 2 + 12; // 12px centers over the 24px wide scaled avatar
      const padding = 10; // 10px safe margin to guarantee staying inside canvas boundaries

      // Calculate ideal center position over character
      const idealLeft = charPixelX - bubbleWidth / 2;
      const minLeft = padding;
      const maxLeft = Math.max(minLeft, containerWidth - bubbleWidth - padding);
      const clampedLeft = Math.min(Math.max(idealLeft, minLeft), maxLeft);

      // Arrow position relative to the speech bubble's left edge
      const idealArrowLeft = charPixelX - clampedLeft;
      const minArrow = 14;
      const maxArrow = Math.max(minArrow, bubbleWidth - 14);
      const clampedArrow = Math.min(Math.max(idealArrowLeft, minArrow), maxArrow);

      setCoords({
        left: Math.round(clampedLeft),
        top: Math.round(Math.max(8, charY * 2 - 30)),
        arrowLeft: Math.round(clampedArrow),
      });
    };

    reposition();

    const ro = new ResizeObserver(reposition);
    ro.observe(container);
    window.addEventListener("resize", reposition);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", reposition);
    };
  }, [charX, charY, text, containerRef]);

  // Initial calculated positions before layout measurement to avoid jump
  const initialCharPixelX = charX * 2 + 12;
  const initialEstWidth = Math.min(220, text.length * 8 + 24);
  const initialLeft = Math.max(10, initialCharPixelX - initialEstWidth / 2);
  const activeLeft = coords ? coords.left : initialLeft;
  const activeTop = coords ? coords.top : Math.max(8, charY * 2 - 30);
  const activeArrowLeft = coords
    ? coords.arrowLeft
    : Math.min(Math.max(14, initialCharPixelX - initialLeft), initialEstWidth - 14);

  return (
    <div
      ref={bubbleRef}
      className="absolute z-20 pointer-events-none transition-all duration-150 animate-in fade-in zoom-in-95 max-w-[calc(100%-20px)]"
      style={{
        left: `${activeLeft}px`,
        top: `${activeTop}px`,
      }}
    >
      <div className="relative px-2.5 py-1 rounded bg-zinc-900/95 dark:bg-zinc-100/95 text-white dark:text-zinc-950 font-mono text-[10px] sm:text-xs shadow-md border border-zinc-700/60 dark:border-zinc-300/60 whitespace-nowrap">
        {text}
        {/* Tiny speech bubble arrow pointing precisely downward to character */}
        <div
          className="absolute -bottom-1 w-2 h-2 -translate-x-1/2 rotate-45 bg-zinc-900/95 dark:bg-zinc-100/95 border-r border-b border-zinc-700/60 dark:border-zinc-300/60"
          style={{
            left: `${activeArrowLeft}px`,
          }}
        />
      </div>
    </div>
  );
}

export function PixelRunner({ onGameModeChange }: PixelRunnerProps) {
  // Detect current light / dark mode by observing documentElement class
  const [theme, setTheme] = useState<ThemeMode>("dark");

  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    window.addEventListener("boardui:theme-change", updateTheme);

    return () => {
      observer.disconnect();
      window.removeEventListener("boardui:theme-change", updateTheme);
    };
  }, []);

  const {
    canvasRef,
    containerRef,
    gameMode,
    currentScore,
    highScore,
    isMuted,
    milestoneMsg,
    speechBubble,
    restartRunnerGame,
    returnToIdle,
    toggleSound,
    handleCharacterClick,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
  } = usePixelRunner(theme);

  useEffect(() => {
    onGameModeChange?.(gameMode);
  }, [gameMode, onGameModeChange]);

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Pixel Avatar and Endless Runner Game"
      tabIndex={0}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={(e) => {
        handleCharacterClick(e.clientX, e.clientY);
      }}
      className="absolute inset-0 w-full h-full select-none cursor-pointer overflow-hidden outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600"
    >
      {/* Visually Hidden Screen-Reader Instruction */}
      <span className="sr-only">
        Interactive pixel avatar: Press Space or Arrow Up to play endless runner.
        Duck with Arrow Down. Normal page scroll is preserved.
      </span>

      {/* Retro Pixel Canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="w-full h-full block"
        style={{
          imageRendering: "pixelated",
        }}
      />

      {/* Floating Speech Bubble in Idle Mode (Clamped inside canvas) */}
      {gameMode === "idle" && speechBubble && (
        <ClampedSpeechBubble
          text={speechBubble.text}
          charX={speechBubble.x}
          charY={speechBubble.y}
          containerRef={containerRef}
        />
      )}

      {/* Milestone Notification Toast */}
      {milestoneMsg && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-1 rounded bg-emerald-500/90 text-white font-mono text-xs font-semibold shadow-lg backdrop-blur-sm border border-emerald-400">
            ★ {milestoneMsg}
          </div>
        </div>
      )}

      {/* Top Controls: Sound Mute Toggle & Idle Info */}
      <div className="absolute top-2 right-2 z-20 flex items-center gap-1.5 pointer-events-auto">
        {/* Runner score badge when active */}
        {gameMode === "running" && (
          <div className="px-2 py-0.5 rounded bg-zinc-900/80 dark:bg-zinc-100/80 text-white dark:text-zinc-950 font-mono text-[11px] font-bold">
            {currentScore} commits {highScore > 0 && <span className="opacity-60 text-[10px]">(best {highScore})</span>}
          </div>
        )}

        {/* Audio Mute / Unmute Toggle */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleSound();
          }}
          className="p-1 rounded bg-zinc-200/60 dark:bg-zinc-800/60 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 transition-colors cursor-pointer"
          title={isMuted ? "Unmute 8-bit sound" : "Mute 8-bit sound"}
          aria-label={isMuted ? "Unmute 8-bit sound" : "Mute 8-bit sound"}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Game Over UI Overlay — clean flex column with zero overlapping text */}
      {gameMode === "gameover" && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-auto bg-black/60 dark:bg-black/75 backdrop-blur-[2px] transition-all animate-in fade-in duration-200">
          <div className="text-center flex flex-col items-center gap-1.5 p-3">
            <span className="font-mono text-base sm:text-lg font-bold tracking-wider text-red-500 uppercase select-none">
              BUILD FAILED
            </span>

            <span className="font-mono text-xs text-zinc-300 dark:text-zinc-200 select-none">
              {currentScore} commits · best: {Math.max(currentScore, highScore)}
            </span>

            <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500 select-none">
              press space or tap to git revert
            </span>

            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  restartRunnerGame();
                }}
                className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                git revert
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  returnToIdle();
                }}
                className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-xs font-medium border border-zinc-700 active:scale-95 transition-all cursor-pointer"
              >
                idle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
