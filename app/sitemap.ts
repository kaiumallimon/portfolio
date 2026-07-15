import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes = [
    "",
    "/projects",
    "/tools",
    "/tools/github-unwrapped",
    "/tools/uiu-exam-routine",
    "/tools/uiu-cgpa-calculator",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
  }));

  const projects = await getProjects();
  const projectRoutes = projects.map((p) => ({
    url: `${SITE_URL}/projects/${p.id}`,
    lastModified: now,
  }));

  return [...staticRoutes, ...projectRoutes];
}
