import { Suspense } from "react";
import FloatingHeader from "@/components/shared/header";
import HomeBackground from "@/components/shared/home-color-bend";
import FlutterFooter from "@/components/custom-new/footer";
import TargetCursor from "@/components/TargetCursor";
import ProjectsIntro from "@/components/custom-new/projects-intro";
import { ProjectsGrid, ProjectsGridSkeleton } from "@/components/custom-new/projects-grid";
import { getProjects } from "@/lib/data";

export const dynamic = "force-dynamic";

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
        <div className="max-w-5xl mx-auto py-42 px-6">
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
