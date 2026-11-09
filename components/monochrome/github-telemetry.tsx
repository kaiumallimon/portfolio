"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { GitHubStats } from "@/lib/github";
import { Flame } from "lucide-react";
import { RiGithubLine, RiGamepadLine } from "@remixicon/react";
import { ActivityCalendar } from "react-activity-calendar";
import "react-activity-calendar/tooltips.css";
import {
  AVAILABLE_YEARS,
  getContributionByYear,
  YearContributionInfo,
} from "@/lib/github-data";
import { Select, SelectItem } from "@/components/base/select/select";
import { ContributionSnake } from "./contribution-snake";
import { cn } from "@/lib/utils";
import { THEME_CHANGE_EVENT } from "@/components/application/theme/theme-toggle";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

export function MonochromeGitHubTelemetry({
  username = "kaiumallimon",
}: {
  stats?: GitHubStats | null;
  username?: string;
}) {
  // Available years: 2026 (running year, Jan 01 to today), 2025, 2024, 2023
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [targetYear, setTargetYear] = useState<number>(2026);
  const [isSnakeLoading, setIsSnakeLoading] = useState<boolean>(false);
  const [isArcadeMode, setIsArcadeMode] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(true);
  const shouldReduceMotion = useReducedMotion();

  // Map of contribution data by year (starts with pre-cached real data)
  const [yearsData, setYearsData] = useState<Record<number, YearContributionInfo>>(() => {
    const map: Record<number, YearContributionInfo> = {};
    AVAILABLE_YEARS.forEach((item) => {
      map[item.year] = item;
    });
    return map;
  });

  // Sync theme
  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    updateTheme();
    window.addEventListener(THEME_CHANGE_EVENT, updateTheme);
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, updateTheme);
      observer.disconnect();
    };
  }, []);

  // Fetch live running-year data on mount
  useEffect(() => {
    let active = true;
    fetch(`/api/github/contributions?year=2026&username=${username}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((live) => {
        if (active && live && live.total !== undefined) {
          setYearsData((prev) => ({
            ...prev,
            2026: live,
          }));
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [username]);

  const currentData: YearContributionInfo = useMemo(() => {
    return yearsData[selectedYear] || getContributionByYear(selectedYear);
  }, [yearsData, selectedYear]);

  const targetData: YearContributionInfo = useMemo(() => {
    return yearsData[targetYear] || getContributionByYear(targetYear);
  }, [yearsData, targetYear]);

  // Year selection change handler
  const handleYearChange = useCallback(
    (newYear: number) => {
      if (newYear === selectedYear && !isSnakeLoading && !isArcadeMode) return;
      setTargetYear(newYear);
      setIsSnakeLoading(true);
      setIsArcadeMode(false);

      // Fetch live data for selected year filter in the background
      fetch(`/api/github/contributions?year=${newYear}&username=${username}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((live) => {
          if (live && live.total !== undefined) {
            setYearsData((prev) => ({
              ...prev,
              [newYear]: live,
            }));
          }
        })
        .catch(() => {});
    },
    [selectedYear, isSnakeLoading, isArcadeMode, username]
  );

  // Snake loading completion
  const handleSnakeComplete = useCallback(() => {
    setSelectedYear(targetYear);
    setIsSnakeLoading(false);
    setIsArcadeMode(false);
  }, [targetYear]);

  // Toggle arcade mode on demand
  const toggleArcade = useCallback(() => {
    setIsArcadeMode((prev) => !prev);
    if (isSnakeLoading) {
      setSelectedYear(targetYear);
      setIsSnakeLoading(false);
    }
  }, [isSnakeLoading, targetYear]);

  const activeData = isSnakeLoading ? targetData : currentData;
  const activeYear = isSnakeLoading ? targetYear : selectedYear;

  // Calculate streak dynamically from the active year's data
  const streakData = useMemo(() => {
    const days = activeData.data || [];
    let longestStreak = 0;
    let tempStreak = 0;

    for (let i = 0; i < days.length; i++) {
      if (days[i].count > 0) {
        tempStreak++;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      } else {
        tempStreak = 0;
      }
    }

    return { longestStreak };
  }, [activeData.data]);

  return (
    <section className="w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
      {/* Calendar Area */}
      <div className="p-4 sm:p-6 overflow-hidden">
        {/* Calendar Summary & Year Select Line */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-500">
          <div className="flex flex-wrap items-center gap-2">
            <div>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                {activeData.total.toLocaleString()} contributions
              </span>{" "}
              in {activeYear}
            </div>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500 hidden sm:inline">
              ({activeData.dateRange})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Play Snake Arcade Toggle */}
            <button
              type="button"
              onClick={toggleArcade}
              title="Play Interactive Snake on contribution graph"
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-md border transition-colors cursor-pointer",
                isArcadeMode
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-xs"
                  : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
              )}
            >
              <RiGamepadLine className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Play Snake</span>
            </button>

            {/* BoardUI Select */}
            <Select
              aria-label="Select Contribution Year"
              selectedKey={String(activeYear)}
              onSelectionChange={(key) => handleYearChange(Number(key))}
              size="sm"
              triggerClassName="min-w-[80px]"
            >
              {AVAILABLE_YEARS.map((y) => (
                <SelectItem
                  key={y.year}
                  id={String(y.year)}
                  textValue={y.label}
                >
                  <span className="font-mono">{y.label}</span>
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>

        {/* Matrix Area: Snake loader OR Arcade OR Sharp Activity Calendar */}
        <div className="min-h-[140px] flex items-center justify-center">
          {isSnakeLoading ? (
            <ContributionSnake
              targetYear={targetYear}
              durationMs={1600}
              onComplete={handleSnakeComplete}
            />
          ) : isArcadeMode ? (
            <ContributionSnake
              targetYear={selectedYear}
              standalone
              onComplete={() => setIsArcadeMode(false)}
            />
          ) : (
            <motion.div
              data-lenis-prevent
              initial={shouldReduceMotion ? false : { clipPath: "inset(0 100% 0 0)" }}
              whileInView={{ clipPath: "inset(0 0% 0 0)" }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.75, ease: EASE_OUT }}
              className="w-full overflow-x-auto py-2 flex justify-center text-zinc-400 dark:text-zinc-500 font-mono [&_rect]:rx-0 [&_rect]:ry-0 [&_.react-activity-calendar__count]:hidden [&_footer>div:first-child:not(:last-child)]:hidden"
            >
              <ActivityCalendar
                data={currentData.data}
                blockSize={11.5}
                blockMargin={3}
                fontSize={11}
                blockRadius={0}
                showTotalCount={false}
                showWeekdayLabels={["mon", "wed", "fri"]}
                colorScheme={isDark ? "dark" : "light"}
                tooltips={{
                  activity: {
                    text: (activity) =>
                      `${activity.count} contributions on ${activity.date}`,
                  },
                }}
                theme={{
                  light: [
                    "#f4f4f5",
                    "#d4d4d8",
                    "#a1a1aa",
                    "#71717a",
                    "#18181b",
                  ],
                  dark: [
                    "#18181b",
                    "#27272a",
                    "#3f3f46",
                    "#71717a",
                    "#fafafa",
                  ],
                }}
              />
            </motion.div>
          )}
        </div>

        {/* Telemetry metrics bar */}
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-900 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            <span
              className="flex items-center gap-1.5"
              title={`Longest streak in ${activeYear}`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-500/80" />
              <span className="text-zinc-900 dark:text-zinc-100 font-medium tabular-nums">
                {streakData.longestStreak}
              </span>
              <span>day streak</span>
            </span>
          </div>

          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors"
          >
            <RiGithubLine className="w-3.5 h-3.5" />
            <span>@{username}</span>
          </a>
        </div>
      </div>

      <div className="stripe-divider h-8 border-t border-zinc-200 dark:border-zinc-800 w-full" />
    </section>
  );
}
