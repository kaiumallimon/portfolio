"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  TextField,
  TextAreaField,
  SwitchField,
  ImageUploader,
  FileUploader,
} from "@/components/admin/fields";
import { Pencil } from "lucide-react";
import { saveSettings } from "@/app/admin/actions";
import type { SiteSettings } from "@/types/content";

function Row({ label, value }: { label: string; value?: string | null | boolean }) {
  const display =
    value === null || value === undefined || value === ""
      ? "—"
      : typeof value === "boolean"
        ? value
          ? "Yes"
          : "No"
        : String(value);
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/60 py-2 last:border-0">
      <dt className="text-sm text-muted-foreground shrink-0">{label}</dt>
      <dd className="text-sm text-foreground text-right break-all max-w-[60%]">
        {display}
      </dd>
    </div>
  );
}

function PreviewCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <dl>{children}</dl>
      </CardContent>
    </Card>
  );
}

export default function SettingsAdmin({
  settings,
}: {
  settings: SiteSettings | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData(e.currentTarget);
      await saveSettings(fd);
      toast.success("Settings saved successfully");
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
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

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Site Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            These values are used across the public website.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit Settings
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PreviewCard
          title="Profile & Hero"
          description="Name, hero copy and profile image."
        >
          <Row label="Display Name" value={settings?.display_name} />
          <Row label="Hero Headline" value={settings?.hero_headline} />
          <Row label="Hero Subheadline" value={settings?.hero_subheadline} />
          <Row label="About Bio" value={settings?.about_bio} />
          <Row label="Available for work" value={settings?.available_status} />
          <Row label="Profile Image" value={settings?.profile_image} />
        </PreviewCard>

        <PreviewCard
          title="Social & Contact"
          description="Links, contact details and GitHub stats."
        >
          <Row label="GitHub URL" value={settings?.github_url} />
          <Row label="LinkedIn URL" value={settings?.linkedin_url} />
          <Row label="Facebook URL" value={settings?.facebook_url} />
          <Row label="Email" value={settings?.email} />
          <Row label="Location" value={settings?.location} />
          <Row label="GitHub Username" value={settings?.github_username} />
          <Row label="Resume PDF" value={settings?.resume_url} />
        </PreviewCard>

        <PreviewCard
          title="SEO"
          description="Search engine metadata for the public site."
        >
          <Row label="SEO Title" value={settings?.seo_title} />
          <Row label="SEO Description" value={settings?.seo_description} />
        </PreviewCard>

        <PreviewCard
          title="Footer"
          description="Footer description and social links."
        >
          <Row label="Footer Description" value={settings?.footer_description} />
          <Row label="Facebook URL" value={settings?.facebook_url} />
        </PreviewCard>
      </div>

      <Dialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
        }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Site Settings</DialogTitle>
            <DialogDescription>
              Update the values used across the public website.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Profile &amp; Hero</h3>
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
            </section>

            <section className="space-y-4 border-t border-border pt-6">
              <h3 className="text-sm font-semibold text-foreground">Social &amp; Contact</h3>
              <TextField label="GitHub URL" name="github_url" defaultValue={settings?.github_url} />
              <TextField label="LinkedIn URL" name="linkedin_url" defaultValue={settings?.linkedin_url} />
              <TextField label="Facebook URL" name="facebook_url" defaultValue={settings?.facebook_url} placeholder="https://facebook.com/your-handle" />
              <TextField label="Email" name="email" defaultValue={settings?.email} />
              <TextField label="Location" name="location" defaultValue={settings?.location} />
              <TextField label="GitHub Username (for live stats)" name="github_username" defaultValue={settings?.github_username} />
              <FileUploader label="Resume PDF" name="resume_url" bucket="resumes" defaultValue={settings?.resume_url} />
            </section>

            <section className="space-y-4 border-t border-border pt-6">
              <h3 className="text-sm font-semibold text-foreground">SEO</h3>
              <TextField label="SEO Title" name="seo_title" defaultValue={settings?.seo_title} />
              <TextAreaField label="SEO Description" name="seo_description" defaultValue={settings?.seo_description} rows={3} />
            </section>

            <section className="space-y-4 border-t border-border pt-6">
              <h3 className="text-sm font-semibold text-foreground">Footer</h3>
              <TextAreaField
                label="Footer Description"
                name="footer_description"
                defaultValue={settings?.footer_description}
                rows={3}
              />
            </section>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
