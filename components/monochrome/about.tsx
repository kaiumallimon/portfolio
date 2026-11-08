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
              I’m <strong>Kaium Al Limon</strong> (call me Limon) — a Full-Stack Software Engineer with a deep focus on Flutter mobile development, modern Next.js web applications, and high-performance backends.
            </span>
          </p>

          <p className="flex items-start gap-2.5">
            <span className="text-zinc-400 select-none">•</span>
            <span>
              Computer Science &amp; Engineering student at{" "}
              <a
                href="https://www.uiu.ac.bd/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-900 dark:text-zinc-100 underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-2 hover:decoration-zinc-900 dark:hover:decoration-zinc-100"
              >
                United International University (UIU)
              </a>
              . Active competitor holding 4 CSE Project Show honors including Champion (Summer &apos;24) and 1st Runner-Up (Fall &apos;24 &amp; Spring &apos;24).
            </span>
          </p>

          <p className="flex items-start gap-2.5">
            <span className="text-zinc-400 select-none">•</span>
            <span>
              Former Head of Software &amp; Innovation at UIU App Forum. Passionate about clean architecture, responsive design systems, and turning real-world constraints into elegant production software.
            </span>
          </p>

          {/* Project highlight 1 */}
          <div className="space-y-1.5 pt-1">
            <p className="flex items-start gap-2.5">
              <span className="text-zinc-400 select-none">•</span>
              <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                Creator of <span className="underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-2">MediTouch</span>: Telemedicine Mobile Platform
              </span>
            </p>
            <div className="pl-5 space-y-1 text-xs text-zinc-500 font-mono">
              <p>• Champion Award in System Analysis &amp; Design (Summer &apos;24)</p>
              <p>• 1st Runner-Up Award in Software Engineering Lab (Fall &apos;24)</p>
            </div>
          </div>

          {/* Project highlight 2 */}
          <div className="space-y-1.5 pt-1">
            <p className="flex items-start gap-2.5">
              <span className="text-zinc-400 select-none">•</span>
              <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                Creator of <span className="underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-2">UIU CGPA Calculator</span> &amp; <span className="underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-2">Dorm of Decents</span>:
              </span>
            </p>
            <div className="pl-5 space-y-1 text-xs text-zinc-500 font-mono">
              <p>• Fast, student-first utilities with zero friction and predictive modeling</p>
              <p>• 100% open-source tools actively maintained on GitHub</p>
            </div>
          </div>
        </div>
      </div>

      <div className="stripe-divider h-8 border-t border-zinc-200 dark:border-zinc-800 w-full" />
    </section>
  );
}
