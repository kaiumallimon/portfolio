"use client";

import { useState } from "react";
import { MonochromeHeader } from "./header";
import { MonochromeHero } from "./hero";
import { MonochromeGitHubTelemetry } from "./github-telemetry";
import { MonochromeAbout } from "./about";
import { MonochromeCommunityStats } from "./community-stats";
import { MonochromeSkills } from "./skills";
import { MonochromeExperience } from "./experience";
import { MonochromeEducation } from "./education";
import { MonochromeProjects } from "./projects-grid";
import { MonochromeRecognition } from "./recognition";
import { MonochromeContactFooter } from "./contact-footer";
import { MonochromeCommandDialog } from "./command-dialog";
import { ISiteSettings, IProject, IExperience } from "@/lib/models";
import { IEducationItem, IAchievementItem } from "@/lib/data-service";
import { GitHubStats } from "@/lib/github";
import { Toaster } from "sonner";

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

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950 transition-colors duration-200">
      <Toaster position="bottom-right" theme="system" />

      {/* Central Editorial CAD Container: exactly 768px (md:max-w-3xl) matching chanhdai.com and top 768 marker */}
      <div className="mx-auto md:max-w-3xl bg-white dark:bg-zinc-950 border-x border-zinc-200 dark:border-zinc-800 min-h-screen">
        {/* Sticky Header with Ctrl+K Command Dialog */}
        <MonochromeHeader
          onOpenCommand={() => setCommandOpen(true)}
          starsCount={gitHubStats?.totalStars || 22}
        />

        {/* Main Architectural Sections */}
        <main>
          {/* 1. Hero with 768 bar, CAD Isometric Cover, 160 avatar, contacts, social links */}
          <MonochromeHero settings={settings} />

          {/* 2. GitHub Contribution Calendar & Telemetry */}
          <MonochromeGitHubTelemetry
            stats={gitHubStats}
            username={settings.githubUsername || "kaiumallimon"}
          />

          {/* 3. About Section with Dynamic Greeting */}
          <MonochromeAbout />

          {/* 4. Growing with the Community (Stats) */}
          <MonochromeCommunityStats />

          {/* 5. Technical Stack Arsenal (4 Categories) */}
          <MonochromeSkills skills={skills} />

          {/* 6. Professional & Leadership Experience (UIU App Forum) */}
          <MonochromeExperience experiences={experiences} />

          {/* 7. Dedicated Education Section (UIU, Safiuddin, Daudpur) */}
          <MonochromeEducation education={education} />

          {/* 8. Selected Works & Projects (All 13 Projects) */}
          <MonochromeProjects projects={projects} />

          {/* 9. Dedicated Recognition Section (4 Project Show Honors) */}
          <MonochromeRecognition achievements={achievements} />

          {/* 10. Message Dispatch & Technical Colophon Footer with Interactive Signature */}
          <MonochromeContactFooter settings={settings} />
        </main>
      </div>

      {/* Command Palette (Ctrl+K) */}
      <MonochromeCommandDialog
        open={commandOpen}
        onOpenChange={setCommandOpen}
      />
    </div>
  );
}
