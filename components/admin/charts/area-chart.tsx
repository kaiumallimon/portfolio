"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface AreaDatum {
  label: string;
  value: number;
}

export function AreaChart({
  data,
  height = 220,
  color = "#6366f1",
}: {
  data: AreaDatum[];
  height?: number;
  color?: string;
}) {
  // Deterministic id (avoids useId hydration mismatches across SSR/client).
  const gid = `area-${color.replace("#", "")}-${data.length}`;
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.value));
  const W = 100;
  const H = 40;
  const step = data.length > 1 ? W / (data.length - 1) : W;

  const points = data.map((d, i) => {
    const x = i * step;
    const y = H - (d.value / max) * (H - 6) - 3;
    return { x, y, ...d };
  });

  const line = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");
  const area = `${line} L ${W} ${H} L 0 ${H} Z`;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="w-full"
        style={{ height }}
      >
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${gid})`} />
        <path
          d={line}
          fill="none"
          stroke={color}
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={active === i ? 2 : 0}
              fill={color}
              stroke="hsl(var(--background))"
              strokeWidth={0.8}
            />
            <rect
              x={Math.max(0, p.x - step / 2)}
              y={0}
              width={step}
              height={H}
              fill="transparent"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            />
          </g>
        ))}
      </svg>

      <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
        {data.map((d, i) => (
          <span
            key={i}
            className={cn(
              "tabular-nums",
              active === i && "font-medium text-foreground",
            )}
          >
            {d.label}
          </span>
        ))}
      </div>

      {active != null && (
        <div className="mt-2 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground tabular-nums">
            {data[active].value}
          </span>{" "}
          in {data[active].label}
        </div>
      )}
    </div>
  );
}
