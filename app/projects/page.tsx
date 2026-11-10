import type { Metadata } from "next";
import { ProjectsArchiveView } from "@/components/monochrome/projects-archive-view";
import { getProjects, getPaginatedProjects, getSiteSettings } from "@/lib/data-service";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const projects = await getProjects();
  const title = `Projects Archive (${projects.length}) — Kaium Al Limon`;
  const description =
    "Curated archive of production mobile applications, high-speed web platforms, APIs, and open-source contributions.";
  const ogImageUrl = `${SITE_URL}/og-image.png`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/projects`,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: `${SITE_URL}/projects`,
      title,
      description,
      siteName: "Kaium Al Limon Portfolio",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@kaiumallimon",
      creator: "@kaiumallimon",
      images: [ogImageUrl],
    },
  };
}

export default async function ProjectsPage() {
  const [allProjects, initialPaginated, settings] = await Promise.all([
    getProjects(),
    getPaginatedProjects({ page: 1, limit: 10 }),
    getSiteSettings(),
  ]);

  return (
    <ProjectsArchiveView
      allProjects={allProjects}
      initialPaginated={initialPaginated}
      settings={settings}
    />
  );
}

