"use client";

import { useRef, useState } from "react";
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

          {/* 5. Skills */}
          <MonochromeSkills skills={skills} />

          {/* 6. Experience */}
          <MonochromeExperience experiences={experiences} />

          {/* 7. Education */}
          <MonochromeEducation education={education} />

          {/* 8. Projects */}
          <MonochromeProjects projects={projects} />

          {/* 9. Recognition */}
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
