"use client";

import { ArrowUpRight } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatarText: string;
  handle?: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "whoa, this is really dope — the regex parsing and sub-millisecond search is so snappy!",
    name: "Kap",
    role: "Developer Community @Vercel",
    avatarText: "KP",
  },
  {
    quote: "one of my favorite projects submitted! you are crushing the design engineering craft.",
    name: "Max Prilutskiy",
    role: "Creator of Lingo.dev",
    avatarText: "MP",
  },
  {
    quote: "congrats, your utility design is so clean and thoughtful!",
    name: "jordwalke",
    role: "Creator of React & ReasonML",
    avatarText: "JW",
  },
  {
    quote: "i like your style! :) the monochrome minimalism feels right at home.",
    name: "Brandon McConnell",
    role: "Frontend Engineer @Mintlify",
    avatarText: "BM",
  },
  {
    quote: "Looks great. Exceptional execution and attention to micro-details.",
    name: "Jean",
    role: "Open Source Builder",
    avatarText: "JN",
  },
];

export function MonochromeTestimonials() {
  return (
    <section className="w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Trusted by top builders &amp; community feedback
        </h2>
        <span className="font-mono text-[11px] text-zinc-400 tabular-nums">
          5 endorsements
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-800">
        {testimonials.slice(0, 3).map((t, i) => (
          <div
            key={i}
            className="p-4 sm:p-5 flex flex-col justify-between space-y-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors"
          >
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed">
              &ldquo;{t.quote}&rdquo;
            </p>

            <div className="flex items-center gap-2.5 pt-3 border-t border-zinc-100 dark:border-zinc-900">
              <div className="size-7 rounded-full bg-zinc-200 dark:bg-zinc-800 text-[10px] font-mono font-bold flex items-center justify-center text-zinc-700 dark:text-zinc-300 shrink-0 border border-zinc-300 dark:border-zinc-700">
                {t.avatarText}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate flex items-center gap-1">
                  <span>{t.name}</span>
                  <ArrowUpRight className="w-2.5 h-2.5 text-zinc-400" />
                </div>
                <div className="text-[10px] text-zinc-400 truncate font-mono">
                  {t.role}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Row 2 (2 cards spanning 50% each) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200 dark:divide-zinc-800 border-t border-zinc-200 dark:border-zinc-800">
        {testimonials.slice(3, 5).map((t, i) => (
          <div
            key={i}
            className="p-4 sm:p-5 flex flex-col justify-between space-y-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors"
          >
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed">
              &ldquo;{t.quote}&rdquo;
            </p>

            <div className="flex items-center gap-2.5 pt-3 border-t border-zinc-100 dark:border-zinc-900">
              <div className="size-7 rounded-full bg-zinc-200 dark:bg-zinc-800 text-[10px] font-mono font-bold flex items-center justify-center text-zinc-700 dark:text-zinc-300 shrink-0 border border-zinc-300 dark:border-zinc-700">
                {t.avatarText}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate flex items-center gap-1">
                  <span>{t.name}</span>
                  <ArrowUpRight className="w-2.5 h-2.5 text-zinc-400" />
                </div>
                <div className="text-[10px] text-zinc-400 truncate font-mono">
                  {t.role}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="stripe-divider h-8 border-t border-zinc-200 dark:border-zinc-800 w-full" />
    </section>
  );
}
