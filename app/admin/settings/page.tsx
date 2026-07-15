import { getSiteSettings } from "@/lib/data";
import { saveSettings } from "@/app/admin/actions";
import { AdminCard, ImageUploader, SwitchField, TextAreaField, TextField } from "@/components/admin/fields";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold text-white">Site Settings</h1>
        <p className="text-sm text-slate-400">Hero text, profile, social links, SEO and GitHub configuration.</p>
      </div>

      <AdminCard title="Profile & Hero">
        <form action={saveSettings} className="space-y-4">
          <TextField label="Display Name" name="display_name" defaultValue={settings?.display_name} />
          <TextAreaField label="Hero Headline" name="hero_headline" defaultValue={settings?.hero_headline} rows={2} />
          <TextAreaField label="Hero Subheadline" name="hero_subheadline" defaultValue={settings?.hero_subheadline} rows={2} />
          <TextAreaField
            label="About Bio (separate paragraphs with a blank line)"
            name="about_bio"
            defaultValue={settings?.about_bio}
            rows={6}
          />
          <SwitchField label="Available for work" name="available_status" defaultChecked={settings?.available_status} />
          <ImageUploader label="Profile Image" name="profile_image" bucket="portfolio-media" defaultValue={settings?.profile_image} />
          <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors">
            Save Settings
          </button>
        </form>
      </AdminCard>

      <AdminCard title="Social & Contact">
        <form action={saveSettings} className="space-y-4">
          <TextField label="GitHub URL" name="github_url" defaultValue={settings?.github_url} />
          <TextField label="LinkedIn URL" name="linkedin_url" defaultValue={settings?.linkedin_url} />
          <TextField label="Email" name="email" defaultValue={settings?.email} />
          <TextField label="Location" name="location" defaultValue={settings?.location} />
          <TextField label="GitHub Username (for live stats)" name="github_username" defaultValue={settings?.github_username} />
          <ImageUploader label="Resume PDF" name="resume_url" bucket="resumes" defaultValue={settings?.resume_url} />
          <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors">
            Save Settings
          </button>
        </form>
      </AdminCard>

      <AdminCard title="SEO">
        <form action={saveSettings} className="space-y-4">
          <TextField label="SEO Title" name="seo_title" defaultValue={settings?.seo_title} />
          <TextAreaField label="SEO Description" name="seo_description" defaultValue={settings?.seo_description} rows={3} />
          <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors">
            Save Settings
          </button>
        </form>
      </AdminCard>
    </div>
  );
}
