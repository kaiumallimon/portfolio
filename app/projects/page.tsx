import type { Metadata } from "next";
import { MonochromeHeader } from "@/components/monochrome/header";
import { MonochromeProjects } from "@/components/monochrome/projects-grid";
import { MonochromeContactFooter } from "@/components/monochrome/contact-footer";
import { getProjects, getSiteSettings } from "@/lib/data-service";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const projects = await getProjects();
  const title = `Projects & Case Studies (${projects.length}) — Kaium Al Limon`;
  const description =
    "Curated archive of production mobile applications, high-speed web platforms, APIs, and open-source contributions.";

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/projects`,
    },
  };
}

export default async function ProjectsPage() {
  const [projects, settings] = await Promise.all([
    getProjects(),
    getSiteSettings(),
  ]);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      <MonochromeHeader />
      <main className="divide-y divide-zinc-200/80 dark:divide-zinc-800/80 pt-6">
        <MonochromeProjects projects={projects} />
        <MonochromeContactFooter settings={settings} />
      </main>
    </div>
  );
}
