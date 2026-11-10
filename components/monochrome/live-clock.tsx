"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function LiveClock({ timezone = "Asia/Dhaka", label = "Dhaka, BD" }: { timezone?: string; label?: string }) {
  const [timeString, setTimeString] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat("en-US", {
          timeZone: timezone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(now);
        setTimeString(formatted);
      } catch {
        setTimeString(new Date().toLocaleTimeString());
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-400 select-none">
      <Clock className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 animate-pulse" />
      <span>{label}</span>
      <span className="text-zinc-300 dark:text-zinc-700">·</span>
      <span className="tabular-nums font-semibold text-zinc-900 dark:text-zinc-200">
        {timeString || "--:--:--"}
      </span>
      <span className="text-[10px] text-zinc-400 dark:text-zinc-500">GMT+6</span>
    </div>
  );
}
