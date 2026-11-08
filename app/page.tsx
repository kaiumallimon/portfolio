import {
  getSiteSettings,
  getProjects,
  getExperiences,
  getSkills,
  getEducation,
  getAchievements,
} from "@/lib/data-service";
import { fetchGitHubStats } from "@/lib/github";
import { MonochromeMainPage } from "@/components/monochrome/main-page";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [
    settings,
    projects,
    experiences,
    skills,
    education,
    achievements,
    gitHubStats,
  ] = await Promise.all([
    getSiteSettings(),
    getProjects(),
    getExperiences(),
    getSkills(),
    getEducation(),
    getAchievements(),
    fetchGitHubStats("kaiumallimon"),
  ]);

  return (
    <MonochromeMainPage
      settings={settings}
      projects={projects}
      experiences={experiences}
      skills={skills}
      education={education}
      achievements={achievements}
      gitHubStats={gitHubStats}
    />
  );
}
