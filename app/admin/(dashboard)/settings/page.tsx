import { getSiteSettings } from "@/lib/data";
import { saveSettings } from "@/app/admin/actions";
import { ImageUploader, SwitchField, TextAreaField, TextField } from "@/components/admin/fields";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Profile & Hero */}
      <Card>
        <CardHeader>
          <CardTitle>Profile &amp; Hero</CardTitle>
          <CardDescription>Hero text, profile image and about bio.</CardDescription>
        </CardHeader>
        <CardContent>
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
            <Button type="submit" className="w-full">
              Save Settings
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Social & Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Social &amp; Contact</CardTitle>
          <CardDescription>Social links, contact details and GitHub stats.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveSettings} className="space-y-4">
            <TextField label="GitHub URL" name="github_url" defaultValue={settings?.github_url} />
            <TextField label="LinkedIn URL" name="linkedin_url" defaultValue={settings?.linkedin_url} />
            <TextField label="Email" name="email" defaultValue={settings?.email} />
            <TextField label="Location" name="location" defaultValue={settings?.location} />
            <TextField label="GitHub Username (for live stats)" name="github_username" defaultValue={settings?.github_username} />
            <ImageUploader label="Resume PDF" name="resume_url" bucket="resumes" defaultValue={settings?.resume_url} />
            <Button type="submit" className="w-full">
              Save Settings
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* SEO */}
      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
          <CardDescription>Search engine metadata for the public site.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveSettings} className="space-y-4">
            <TextField label="SEO Title" name="seo_title" defaultValue={settings?.seo_title} />
            <TextAreaField label="SEO Description" name="seo_description" defaultValue={settings?.seo_description} rows={3} />
            <Button type="submit" className="w-full">
              Save Settings
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Footer */}
      <Card>
        <CardHeader>
          <CardTitle>Footer</CardTitle>
          <CardDescription>Footer description and social links shown across the site.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveSettings} className="space-y-4">
            <TextAreaField
              label="Footer Description"
              name="footer_description"
              defaultValue={settings?.footer_description}
              rows={3}
            />
            <TextField label="Facebook URL" name="facebook_url" defaultValue={settings?.facebook_url} placeholder="https://facebook.com/your-handle" />
            <Button type="submit" className="w-full">
              Save Settings
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
