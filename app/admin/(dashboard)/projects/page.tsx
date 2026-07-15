import { getProjects } from "@/lib/data";
import ProjectsAdmin from "@/components/admin/projects-admin";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await getProjects();
  return <ProjectsAdmin projects={projects} />;
}
