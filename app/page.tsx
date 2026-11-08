import {
  getSiteSettings,
  getProjects,
  getExperiences,
  getSkills,
} from "@/lib/data-service";
import { fetchGitHubStats } from "@/lib/github";
import { MonochromeMainPage } from "@/components/monochrome/main-page";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [settings, projects, experiences, skills, gitHubStats] = await Promise.all([
    getSiteSettings(),
    getProjects(),
    getExperiences(),
    getSkills(),
    fetchGitHubStats("kaiumallimon"),
  ]);

  return (
    <MonochromeMainPage
      settings={settings}
      projects={projects}
      experiences={experiences}
      skills={skills}
      gitHubStats={gitHubStats}
    />
  );
}
