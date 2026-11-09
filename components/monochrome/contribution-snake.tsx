"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

interface Point {
  x: number;
  y: number;
}

interface ContributionSnakeProps {
  onComplete?: () => void;
  targetYear: number;
  durationMs?: number;
  standalone?: boolean;
}

const COLS = 53;
const ROWS = 7;
const CELL_SIZE = 11.5;
const GAP = 3;
const STEP = CELL_SIZE + GAP; // 14.5px
const LABEL_WIDTH = 28; // width for Mon, Wed, Fri
const SVG_WIDTH = COLS * STEP - GAP + LABEL_WIDTH;
const SVG_HEIGHT = ROWS * STEP - GAP;

function getDistance(p1: Point, p2: Point): number {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

export function ContributionSnake({
  onComplete,
  targetYear,
  durationMs = 1500,
  standalone = false,
}: ContributionSnakeProps) {
  // Initial snake: 5 segments moving to the right
  const [snake, setSnake] = useState<Point[]>([
    { x: 12, y: 3 },
    { x: 11, y: 3 },
    { x: 10, y: 3 },
    { x: 9, y: 3 },
    { x: 8, y: 3 },
  ]);

  const [dir, setDir] = useState<Point>({ x: 1, y: 0 });
  const [foods, setFoods] = useState<Point[]>([
    { x: 20, y: 2 },
    { x: 32, y: 5 },
    { x: 44, y: 1 },
    { x: 8, y: 5 },
  ]);
  const [score, setScore] = useState<number>(0);
  const [isUserControlled, setIsUserControlled] = useState<boolean>(false);

  // Refs for animation loop
  const snakeRef = useRef(snake);
  snakeRef.current = snake;
  const dirRef = useRef(dir);
  dirRef.current = dir;
  const foodsRef = useRef(foods);
  foodsRef.current = foods;
  const isUserControlledRef = useRef(isUserControlled);
  isUserControlledRef.current = isUserControlled;

  // Key handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let nextDir: Point | null = null;
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        if (dirRef.current.y !== 1) nextDir = { x: 0, y: -1 };
      } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        if (dirRef.current.y !== -1) nextDir = { x: 0, y: 1 };
      } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        if (dirRef.current.x !== 1) nextDir = { x: -1, y: 0 };
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        if (dirRef.current.x !== -1) nextDir = { x: 1, y: 0 };
      } else if (e.key === "Escape" && onComplete) {
        onComplete();
      }

      if (nextDir) {
        e.preventDefault();
        setDir(nextDir);
        setIsUserControlled(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onComplete]);

  // Autonomous pathfinding logic towards nearest food
  const getAutoDirection = useCallback((currentHead: Point, currentDir: Point, currentFoods: Point[]) => {
    if (currentFoods.length === 0) return currentDir;

    // Find nearest food
    let nearest = currentFoods[0];
    let minDist = getDistance(currentHead, nearest);
    for (const f of currentFoods) {
      const d = getDistance(currentHead, f);
      if (d < minDist) {
        minDist = d;
        nearest = f;
      }
    }

    const possibleDirs: Point[] = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
    ];

    // Filter out opposite direction (can't reverse into own body)
    const validDirs = possibleDirs.filter(
      (d) => !(d.x === -currentDir.x && d.y === -currentDir.y)
    );

    // Sort valid dirs by distance to nearest food from candidate head
    validDirs.sort((a, b) => {
      const posA = {
        x: (currentHead.x + a.x + COLS) % COLS,
        y: (currentHead.y + a.y + ROWS) % ROWS,
      };
      const posB = {
        x: (currentHead.x + b.x + COLS) % COLS,
        y: (currentHead.y + b.y + ROWS) % ROWS,
      };
      return getDistance(posA, nearest) - getDistance(posB, nearest);
    });

    return validDirs[0] || currentDir;
  }, []);

  // Main step loop (every 75ms)
  useEffect(() => {
    const timer = setInterval(() => {
      const currentSnake = snakeRef.current;
      const head = currentSnake[0];
      let currentDir = dirRef.current;

      // If user hasn't steered, auto-navigate
      if (!isUserControlledRef.current) {
        currentDir = getAutoDirection(head, currentDir, foodsRef.current);
        setDir(currentDir);
      }

      const newHead: Point = {
        x: (head.x + currentDir.x + COLS) % COLS,
        y: (head.y + currentDir.y + ROWS) % ROWS,
      };

      // Check food collision
      const foodIndex = foodsRef.current.findIndex(
        (f) => f.x === newHead.x && f.y === newHead.y
      );

      let nextSnake: Point[];
      if (foodIndex !== -1) {
        // Ate food! Grow snake
        nextSnake = [newHead, ...currentSnake];
        setScore((s) => s + 1);

        // Spawn new food at unoccupied spot
        const newFoods = foodsRef.current.filter((_, idx) => idx !== foodIndex);
        let rx: number, ry: number;
        let attempts = 0;
        do {
          rx = Math.floor(Math.random() * COLS);
          ry = Math.floor(Math.random() * ROWS);
          attempts++;
        } while (
          attempts < 50 &&
          (nextSnake.some((s) => s.x === rx && s.y === ry) ||
            newFoods.some((f) => f.x === rx && f.y === ry))
        );
        newFoods.push({ x: rx, y: ry });
        setFoods(newFoods);
      } else {
        // Normal movement
        nextSnake = [newHead, ...currentSnake.slice(0, -1)];
      }

      setSnake(nextSnake);
    }, 75);

    return () => clearInterval(timer);
  }, [getAutoDirection]);

  // Auto-complete loading timer if not standalone mode
  useEffect(() => {
    if (standalone || !onComplete) return;

    const timeout = setTimeout(() => {
      onComplete();
    }, durationMs);

    return () => clearTimeout(timeout);
  }, [standalone, onComplete, durationMs]);

  // Convert snake and food positions to set for quick cell lookup
  const headPos = snake[0];
  const snakeMap = new Map<string, number>();
  snake.forEach((pt, idx) => {
    snakeMap.set(`${pt.x},${pt.y}`, idx);
  });

  const foodSet = new Set(foods.map((f) => `${f.x},${f.y}`));

  return (
    <div className="w-full flex flex-col items-center select-none py-1 animate-in fade-in duration-200">
      <div className="overflow-x-auto w-full flex justify-center py-2">
        <svg
          width={SVG_WIDTH}
          height={SVG_HEIGHT}
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="block"
          style={{ maxWidth: "100%", height: "auto" }}
        >
          {/* Weekday labels Mon, Wed, Fri matching GitHub & ActivityCalendar */}
          <text
            x={LABEL_WIDTH - 6}
            y={1 * STEP + CELL_SIZE / 2}
            dominantBaseline="central"
            textAnchor="end"
            className="fill-zinc-400 dark:fill-zinc-500 font-mono text-[10px]"
          >
            Mon
          </text>
          <text
            x={LABEL_WIDTH - 6}
            y={3 * STEP + CELL_SIZE / 2}
            dominantBaseline="central"
            textAnchor="end"
            className="fill-zinc-400 dark:fill-zinc-500 font-mono text-[10px]"
          >
            Wed
          </text>
          <text
            x={LABEL_WIDTH - 6}
            y={5 * STEP + CELL_SIZE / 2}
            dominantBaseline="central"
            textAnchor="end"
            className="fill-zinc-400 dark:fill-zinc-500 font-mono text-[10px]"
          >
            Fri
          </text>

          {Array.from({ length: COLS }).map((_, c) =>
            Array.from({ length: ROWS }).map((__, r) => {
              const key = `${c},${r}`;
              const isHead = headPos.x === c && headPos.y === r;
              const snakeIndex = snakeMap.get(key);
              const isFood = foodSet.has(key);

              let fillClass =
                "fill-zinc-100 dark:fill-zinc-900 transition-colors duration-100";

              if (isHead) {
                // Bright high-contrast snake head
                fillClass = "fill-zinc-950 dark:fill-zinc-50";
              } else if (snakeIndex !== undefined) {
                // Monochrome gradient body
                if (snakeIndex === 1) {
                  fillClass = "fill-zinc-800 dark:fill-zinc-200";
                } else if (snakeIndex === 2) {
                  fillClass = "fill-zinc-700 dark:fill-zinc-300";
                } else if (snakeIndex === 3) {
                  fillClass = "fill-zinc-500 dark:fill-zinc-500";
                } else if (snakeIndex === 4) {
                  fillClass = "fill-zinc-400 dark:fill-zinc-600";
                } else {
                  fillClass = "fill-zinc-300 dark:fill-zinc-700";
                }
              } else if (isFood) {
                // Food cell - high intensity
                fillClass = "fill-emerald-600 dark:fill-emerald-400";
              }

              return (
                <rect
                  key={key}
                  x={LABEL_WIDTH + c * STEP}
                  y={r * STEP}
                  width={CELL_SIZE}
                  height={CELL_SIZE}
                  rx={0}
                  ry={0}
                  className={fillClass}
                />
              );
            })
          )}
        </svg>
      </div>

      {/* Snake Telemetry / Loading Status Bar */}
      <div className="w-full max-w-[795px] mt-2 pt-2 border-t border-dashed border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-zinc-900 dark:text-zinc-100 font-medium">
            {standalone ? "Snake Arcade" : `Loading ${targetYear} data...`}
          </span>
          {score > 0 && (
            <span className="text-zinc-400 dark:text-zinc-500">
              ({score} {score === 1 ? "cell" : "cells"} eaten)
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1 text-zinc-400 dark:text-zinc-500">
            <span>Steer with</span>
            <kbd className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
              ↑
            </kbd>
            <kbd className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
              ↓
            </kbd>
            <kbd className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
              ←
            </kbd>
            <kbd className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
              →
            </kbd>
          </span>

          {onComplete && (
            <button
              onClick={onComplete}
              className="text-[11px] font-mono text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-2 transition-colors cursor-pointer"
            >
              {standalone ? "Close Arcade" : "Skip"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
