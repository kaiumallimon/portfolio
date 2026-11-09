"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface DonutDatum {
  label: string;
  value: number;
  color: string;
}

export function DonutChart({
  data,
  size = 184,
  thickness = 22,
  unit = "Total",
  showPercentage = false,
}: {
  data: DonutDatum[];
  size?: number;
  thickness?: number;
  unit?: string;
  showPercentage?: boolean;
}) {
  const [active, setActive] = useState<number | null>(null);
  const total = data.reduce((s, d) => s + d.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;

  let offset = 0;
  const segments = data
    .map((d, idx) => ({ ...d, idx }))
    .filter((d) => d.value > 0)
    .map((d) => {
      const len = total > 0 ? (d.value / total) * circumference : 0;
      const seg = { ...d, len, dashOffset: -offset };
      offset += len;
      return seg;
    });

  const center = active != null ? data[active] : null;
  const pct = (v: number) =>
    total > 0 ? Math.round((v / total) * 100) : 0;

  if (total === 0) {
    return (
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div
          className="relative shrink-0"
          style={{ width: size, height: size }}
        >
          <div className="absolute inset-0 flex items-center justify-center rounded-full border border-dashed border-border" />
          <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
            No data
          </div>
        </div>
        <ul className="grid w-full grid-cols-1 gap-2">
          {data.map((d) => (
            <li
              key={d.label}
              className="flex items-center justify-between gap-2 text-sm"
            >
              <span className="flex items-center gap-2 min-w-0">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: d.color }}
                />
                <span className="truncate text-muted-foreground">{d.label}</span>
              </span>
              <span className="font-medium tabular-nums text-foreground">0</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
      <div
        className="relative shrink-0"
        style={{ width: size, height: size }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
        >
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-border"
            strokeWidth={thickness}
          />
          {segments.map((s) => (
            <circle
              key={s.label}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={s.color}
              strokeWidth={active === s.idx ? thickness + 5 : thickness}
              strokeDasharray={`${s.len} ${circumference - s.len}`}
              strokeDashoffset={s.dashOffset}
              strokeLinecap="round"
              className="cursor-pointer transition-all duration-300"
              onMouseEnter={() => setActive(s.idx)}
              onMouseLeave={() => setActive(null)}
            />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold text-foreground tabular-nums">
            {center
              ? showPercentage
                ? `${pct(center.value)}%`
                : center.value
              : showPercentage
                ? data.length
                : total}
          </span>
          <span className="max-w-[6rem] text-xs text-muted-foreground">
            {center ? center.label : unit}
          </span>
        </div>
      </div>
      <ul className="grid w-full grid-cols-1 gap-2">
        {data.map((d, i) => (
          <li
            key={d.label}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            className={cn(
              "flex items-center justify-between gap-2 rounded-md px-2 py-1 text-sm transition-colors",
              active === i && "bg-muted/60",
            )}
          >
            <span className="flex items-center gap-2 min-w-0">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: d.color }}
              />
              <span className="truncate text-muted-foreground">{d.label}</span>
            </span>
            <span className="font-medium tabular-nums text-foreground">
              {showPercentage ? `${pct(d.value)}%` : d.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
