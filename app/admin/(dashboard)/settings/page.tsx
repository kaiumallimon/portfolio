import { getSiteSettings } from "@/lib/data";
import SettingsAdmin from "@/components/admin/settings-admin";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return <SettingsAdmin settings={settings} />;
}
