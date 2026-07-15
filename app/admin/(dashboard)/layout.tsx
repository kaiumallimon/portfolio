import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/supabase/auth";
import AdminShell from "@/components/admin/shell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  return <AdminShell email={user.email ?? "admin"}>{children}</AdminShell>;
}
