"use client";

import { useState } from "react";
import { MonochromeHeader } from "./header";
import { MonochromeHero } from "./hero";
import { MonochromeAbout } from "./about";
import { MonochromeTestimonials } from "./testimonials";
import { InteractiveShowcase } from "./interactive-showcase";
import { MonochromeProjects } from "./projects-grid";
import { MonochromeExperience } from "./experience";
import { MonochromeSkills } from "./skills";
import { MonochromeGitHubTelemetry } from "./github-telemetry";
import { MonochromeContactFooter } from "./contact-footer";
import { MonochromeCommandDialog } from "./command-dialog";
import { ISiteSettings, IProject, IExperience } from "@/lib/models";
import { GitHubStats } from "@/lib/github";
import { Toaster } from "sonner";

interface MainPageProps {
  settings: ISiteSettings;
  projects: Partial<IProject>[];
  experiences: Partial<IExperience>[];
  skills: { category: string; skills: string[] }[];
  gitHubStats: GitHubStats | null;
}

export function MonochromeMainPage({
  settings,
  projects,
  experiences,
  skills,
  gitHubStats,
}: MainPageProps) {
  const [commandOpen, setCommandOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950 transition-colors duration-200">
      <Toaster position="bottom-right" theme="system" />

      {/* Centered Editorial Canvas matching chanhdai.com (wider canvas) */}
      <div className="max-w-5xl mx-auto bg-white dark:bg-zinc-950 border-x border-zinc-200/80 dark:border-zinc-800/80 min-h-screen shadow-xs">
        {/* Header */}
        <MonochromeHeader
          onOpenCommand={() => setCommandOpen(true)}
          starsCount={gitHubStats?.totalStars || 142}
        />

        {/* Main Content Sections */}
        <main className="divide-y divide-zinc-200/80 dark:divide-zinc-800/80">
          <MonochromeHero settings={settings} />
          <MonochromeAbout />
          <MonochromeTestimonials />
          <InteractiveShowcase />
          <MonochromeProjects projects={projects} />
          <MonochromeExperience experiences={experiences} />
          <MonochromeSkills skills={skills} />
          <MonochromeGitHubTelemetry stats={gitHubStats} username="kaiumallimon" />
          <MonochromeContactFooter settings={settings} />
        </main>
      </div>

      {/* Command Palette (Cmd+K) */}
      <MonochromeCommandDialog
        open={commandOpen}
        onOpenChange={setCommandOpen}
      />
    </div>
  );
}
