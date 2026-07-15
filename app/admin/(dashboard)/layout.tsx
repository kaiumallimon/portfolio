import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/supabase/auth";
import { getSiteSettings } from "@/lib/data";
import AdminShell from "@/components/admin/shell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const settings = await getSiteSettings();

  return (
    <AdminShell email={user.email ?? "admin"} profileImage={settings?.profile_image}>
      {children}
    </AdminShell>
  );
}
