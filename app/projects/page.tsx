import type { Metadata } from "next";
import { Suspense } from "react";
import FloatingHeader from "@/components/shared/header";
import HomeBackground from "@/components/shared/home-color-bend";
import FlutterFooter from "@/components/custom-new/footer";
import TargetCursor from "@/components/TargetCursor";
import ProjectsIntro from "@/components/custom-new/projects-intro";
import { ProjectsGrid, ProjectsGridSkeleton } from "@/components/custom-new/projects-grid";
import { getProjects } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const projects = await getProjects();
  const title = `Projects & Case Studies (${projects.length}) | Kaium Al Limon`;
  const description =
    "Explore a curated archive of production mobile applications (Flutter), high-speed web platforms (Next.js), APIs, and open-source contributions by Kaium Al Limon.";

  return {
    title: "Projects & Production Case Studies",
    description,
    keywords: [
      "Flutter Projects",
      "Next.js Projects",
      "Mobile Applications",
      "Web Platforms",
      "Full-Stack Case Studies",
      "Kaium Al Limon Projects",
      "Open Source Software",
    ],
    alternates: {
      canonical: `${SITE_URL}/projects`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/projects`,
      type: "website",
      siteName: "Kaium Al Limon Portfolio",
    },
  };
}

async function ProjectsList() {
  const projects = await getProjects();
  return <ProjectsGrid projects={projects} />;
}

export default function ProjectsPage() {
  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-300 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      <TargetCursor spinDuration={2} hideDefaultCursor parallaxOn hoverDuration={0.2} />

      <HomeBackground />
      <FloatingHeader />

      <div className="relative">
        <div className="max-w-6xl mx-auto py-42 px-6">
          <ProjectsIntro />

          <div className="mt-16">
            <Suspense fallback={<ProjectsGridSkeleton />}>
              <ProjectsList />
            </Suspense>
          </div>
        </div>
        <FlutterFooter />
      </div>
    </div>
  );
}
