"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface BarDatum {
  label: string;
  value: number;
  color?: string;
}

export function BarChart({
  data,
  height = 220,
  unit = "",
}: {
  data: BarDatum[];
  height?: number;
  unit?: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.value));
  const base = "#6366f1";

  return (
    <div className="w-full">
      <div className="flex items-end gap-2 sm:gap-3" style={{ height }}>
        {data.map((d, i) => {
          const pct = (d.value / max) * 100;
          return (
            <div
              key={d.label}
              className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2"
            >
              <div className="relative flex w-full flex-1 items-end justify-center">
                <span
                  className="pointer-events-none absolute -top-6 z-10 whitespace-nowrap rounded-md bg-popover px-2 py-0.5 text-xs font-medium text-popover-foreground shadow-md transition-opacity"
                  style={{ opacity: active === i ? 1 : 0 }}
                >
                  {d.value}
                  {unit}
                </span>
                <div
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  className={cn(
                    "w-full max-w-[40px] rounded-t-md transition-all duration-500",
                    active === i ? "opacity-100" : "opacity-80 hover:opacity-100",
                  )}
                  style={{
                    height: `${Math.max(pct, 2)}%`,
                    backgroundColor: d.color || base,
                  }}
                />
              </div>
              <span
                className={cn(
                  "truncate text-[11px]",
                  active === i
                    ? "text-foreground font-medium"
                    : "text-muted-foreground",
                )}
                title={d.label}
              >
                {d.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
