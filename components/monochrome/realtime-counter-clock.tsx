"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface TimeParts {
  h: string;
  m: string;
  s: string;
  p: string;
}

export function getDhakaTimeParts(timezone: string = "Asia/Dhaka"): TimeParts {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    const parts = formatter.formatToParts(new Date());
    let h = "12",
      m = "00",
      s = "00",
      p = "AM";
    for (const part of parts) {
      if (part.type === "hour") h = part.value;
      else if (part.type === "minute") m = part.value;
      else if (part.type === "second") s = part.value;
      else if (part.type === "dayPeriod") p = part.value.toUpperCase();
    }
    return {
      h: h.padStart(2, "0"),
      m: m.padStart(2, "0"),
      s: s.padStart(2, "0"),
      p: p || "AM",
    };
  } catch {
    const d = new Date();
    let hours = d.getHours();
    const p = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return {
      h: String(hours).padStart(2, "0"),
      m: String(d.getMinutes()).padStart(2, "0"),
      s: String(d.getSeconds()).padStart(2, "0"),
      p,
    };
  }
}

function CounterDigit({
  digit,
  className,
}: {
  digit: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-[1.35em] w-[0.62em] items-center justify-center tabular-nums font-mono leading-none",
        className
      )}
    >
      {digit}
    </span>
  );
}

function CounterPeriod({ period }: { period: string }) {
  return (
    <span className="inline-flex h-[1.35em] w-[1.7em] items-center justify-center tabular-nums font-mono leading-none text-zinc-500 dark:text-zinc-400 text-xs sm:text-[13px] ml-1 font-medium">
      {period}
    </span>
  );
}

function ColonSeparator() {
  return (
    <span className="text-zinc-400 dark:text-zinc-500 font-mono select-none px-[1px] leading-none">
      :
    </span>
  );
}

export function RealtimeCounterClock({
  timezone = "Asia/Dhaka",
}: {
  timezone?: string;
}) {
  const [time, setTime] = useState<TimeParts>(() => getDhakaTimeParts(timezone));

  useEffect(() => {
    const update = () => {
      setTime(getDhakaTimeParts(timezone));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  return (
    <div
      suppressHydrationWarning
      className="inline-flex items-center text-zinc-700 dark:text-zinc-300 font-mono text-xs sm:text-sm tabular-nums leading-none select-none"
    >
      {/* Hours in 12-hour format */}
      <CounterDigit digit={time.h[0]} />
      <CounterDigit digit={time.h[1]} />

      <ColonSeparator />

      {/* Minutes */}
      <CounterDigit digit={time.m[0]} />
      <CounterDigit digit={time.m[1]} />

      <ColonSeparator />

      {/* Seconds with live counter animation */}
      <CounterDigit
        digit={time.s[0]}
        className="text-zinc-950 dark:text-zinc-100 font-medium"
      />
      <CounterDigit
        digit={time.s[1]}
        className="text-zinc-950 dark:text-zinc-100 font-medium"
      />

      {/* AM / PM */}
      <CounterPeriod period={time.p} />

      {/* Timezone Label */}
      <span className="text-zinc-400 dark:text-zinc-500 ml-2 font-mono text-xs sm:text-sm">
        {"//"} Dhaka (GMT+6)
      </span>
    </div>
  );
}
