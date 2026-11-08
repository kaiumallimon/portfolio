"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { MonochromeHeader } from "./header";
import { MonochromeHero } from "./hero";
import type { ISiteSettings, IProject, IExperience } from "@/lib/models";
import type { IEducationItem, IAchievementItem } from "@/lib/data-service";
import type { GitHubStats } from "@/lib/github";
import { Toaster } from "sonner";

// Lazy-loaded below-the-fold sections for instant initial page rendering
const MonochromeGitHubTelemetry = dynamic(
  () => import("./github-telemetry").then((m) => m.MonochromeGitHubTelemetry),
  {
    loading: () => (
      <div className="w-full h-44 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/10" />
    ),
  }
);

const MonochromeAbout = dynamic(
  () => import("./about").then((m) => m.MonochromeAbout),
  {
    loading: () => (
      <div className="w-full h-32 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/10" />
    ),
  }
);

const MonochromeCommunityStats = dynamic(
  () => import("./community-stats").then((m) => m.MonochromeCommunityStats),
  {
    loading: () => (
      <div className="w-full h-36 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/10" />
    ),
  }
);

const MonochromeSkills = dynamic(
  () => import("./skills").then((m) => m.MonochromeSkills),
  {
    loading: () => (
      <div className="w-full h-56 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/10" />
    ),
  }
);

const MonochromeEducation = dynamic(
  () => import("./education").then((m) => m.MonochromeEducation),
  {
    loading: () => (
      <div className="w-full h-48 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/10" />
    ),
  }
);

const MonochromeExperience = dynamic(
  () => import("./experience").then((m) => m.MonochromeExperience),
  {
    loading: () => (
      <div className="w-full h-56 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/10" />
    ),
  }
);

const MonochromeProjects = dynamic(
  () => import("./projects-grid").then((m) => m.MonochromeProjects),
  {
    loading: () => (
      <div className="w-full h-80 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/10" />
    ),
  }
);

const MonochromeThesis = dynamic(
  () => import("./thesis").then((m) => m.MonochromeThesis),
  {
    loading: () => (
      <div className="w-full h-64 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/10" />
    ),
  }
);

const MonochromeRecognition = dynamic(
  () => import("./recognition").then((m) => m.MonochromeRecognition),
  {
    loading: () => (
      <div className="w-full h-80 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/10" />
    ),
  }
);

const MonochromeContactFooter = dynamic(
  () => import("./contact-footer").then((m) => m.MonochromeContactFooter),
  {
    loading: () => (
      <div className="w-full h-72 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/10" />
    ),
  }
);

const MonochromeCommandDialog = dynamic(
  () => import("./command-dialog").then((m) => m.MonochromeCommandDialog)
);

interface MainPageProps {
  settings: ISiteSettings;
  projects: Partial<IProject>[];
  experiences: Partial<IExperience>[];
  skills: { category: string; skills: string[] }[];
  education: IEducationItem[];
  achievements: IAchievementItem[];
  gitHubStats: GitHubStats | null;
}

export function MonochromeMainPage({
  settings,
  projects,
  experiences,
  skills,
  education,
  achievements,
  gitHubStats,
}: MainPageProps) {
  const [commandOpen, setCommandOpen] = useState(false);
  // ref attached to the cover section — shared with Header for scroll-driven KAL animation
  const coverRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950 transition-colors duration-200">
      <Toaster position="bottom-right" theme="system" />

      {/* Central Editorial Container: max-w-5xl */}
      <div className="mx-auto max-w-5xl bg-white dark:bg-zinc-950 border-x border-zinc-200 dark:border-zinc-800 min-h-screen">
        {/* Sticky Header — receives coverRef to drive KAL scroll animation */}
        <MonochromeHeader
          onOpenCommand={() => setCommandOpen(true)}
          starsCount={gitHubStats?.totalStars || 22}
          coverRef={coverRef}
        />

        <main>
          {/* 1. Hero — coverRef attached to the cover div */}
          <MonochromeHero settings={settings} coverRef={coverRef} />

          {/* 2. GitHub Contribution Calendar & Telemetry */}
          <MonochromeGitHubTelemetry
            stats={gitHubStats}
            username={settings.githubUsername || "kaiumallimon"}
          />

          {/* 3. About */}
          <MonochromeAbout />

          {/* 4. Community Stats */}
          <MonochromeCommunityStats />

          {/* 5. Stack */}
          <MonochromeSkills skills={skills} />

          {/* 6. Education */}
          <MonochromeEducation education={education} />

          {/* 7. Co-Curricular & Engineering Leadership */}
          <MonochromeExperience experiences={experiences} />

          {/* 8. Projects */}
          <MonochromeProjects projects={projects} />

          {/* 9. Thesis & Defense Project */}
          <MonochromeThesis />

          {/* 10. Recognition */}
          <MonochromeRecognition achievements={achievements} />

          {/* 10. Footer */}
          <MonochromeContactFooter settings={settings} />
        </main>
      </div>

      {/* Command Palette */}
      <MonochromeCommandDialog
        open={commandOpen}
        onOpenChange={setCommandOpen}
      />
    </div>
  );
}
