import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/supabase/auth";
import AdminSidebar from "@/components/admin/sidebar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-200 flex">
      <AdminSidebar email={user.email ?? "admin"} />
      <main className="flex-1 min-w-0 p-8 overflow-x-hidden">{children}</main>
    </div>
  );
}
