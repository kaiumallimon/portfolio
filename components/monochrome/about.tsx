"use client";

import { useEffect, useState } from "react";

export function MonochromeAbout() {
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Good morning");
    else if (hour >= 12 && hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <section id="about" className="w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
      <div className="p-4 sm:p-6 space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
          {greeting}
        </h2>

        <div className="space-y-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
          <p className="flex items-start gap-2.5">
            <span className="text-zinc-400 select-none">•</span>
            <span>
              I&apos;m <strong>Kaium Al Limon</strong>, a software engineer who enjoys turning ideas and complex problems into practical, well-engineered software.
            </span>
          </p>

          <p className="flex items-start gap-2.5">
            <span className="text-zinc-400 select-none">•</span>
            <span>
              A Computer Science &amp; Engineering graduate from{" "}
              <a
                href="https://www.uiu.ac.bd/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-900 dark:text-zinc-100 underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-2 hover:decoration-zinc-900 dark:hover:decoration-zinc-100"
              >
                United International University (UIU)
              </a>
              , I specialize in cross-platform mobile development with Flutter, modern web applications with Next.js, and backend engineering. I care about clean architecture, thoughtful user experiences, performance, and building software that solves actual problems.
            </span>
          </p>

          <p className="flex items-start gap-2.5">
            <span className="text-zinc-400 select-none">•</span>
            <span>
              Over the years, I&apos;ve worked on several academic, personal, and collaborative projects, taking ideas from initial concepts to functional products.
            </span>
          </p>
        </div>
      </div>

      <div className="stripe-divider h-8 border-t border-zinc-200 dark:border-zinc-800 w-full" />
    </section>
  );
}
