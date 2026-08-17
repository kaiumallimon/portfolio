"use client";

import React, { useState } from "react";
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
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  User,
  Sparkles,
  Share2,
  FileText,
  Search,
  PanelBottom,
  Pencil,
  ExternalLink,
  Github,
  Linkedin,
  Facebook,
  Mail,
  MapPin,
  CheckCircle2,
  Download,
  Eye,
  FileUp,
} from "lucide-react";
import { saveSettings } from "@/app/admin/actions";
import type { SiteSettings } from "@/types/content";
import { cn } from "@/lib/utils";

type ActiveModal =
  | "profile"
  | "hero"
  | "social"
  | "resume"
  | "seo"
  | "footer"
  | null;

export default function SettingsAdmin({
  settings,
}: {
  settings: SiteSettings | null;
}) {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData(e.currentTarget);
      await saveSettings(fd);
      toast.success("Settings updated successfully");
      setActiveModal(null);
      router.refresh();
    } catch {
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const initials = (settings?.display_name?.charAt(0) || "K").toUpperCase();

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
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

      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Site Settings & Preferences</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your personal profile, hero headline, social presence, resume, and search engine metadata.
          </p>
        </div>
      </div>

      {/* Grid of Modular, Card-Specific Settings */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ========================================================================= */}
        {/* CARD 1: Profile & Identity */}
        {/* ========================================================================= */}
        <Card className="flex flex-col justify-between">
          <div>
            <CardHeader className="flex flex-row items-start justify-between pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">Profile & Identity</CardTitle>
                  <CardDescription className="text-xs">
                    Display name, avatar image, and availability status.
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="cursor-target shrink-0 gap-1.5"
                onClick={() => setActiveModal("profile")}
              >
                <Pencil className="h-3.5 w-3.5" />
                <span>Edit Profile</span>
              </Button>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-muted/20 p-4">
                <div className="relative">
                  {settings?.profile_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={settings.profile_image}
                      alt={settings?.display_name || "Profile"}
                      className="h-16 w-16 rounded-full object-cover border-2 border-indigo-500/30"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white shadow-inner">
                      {initials}
                    </div>
                  )}
                  <span
                    className={cn(
                      "absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-card",
                      settings?.available_status ? "bg-emerald-500" : "bg-slate-500"
                    )}
                  />
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground truncate">
                      {settings?.display_name || "Kaium Al Limon"}
                    </h3>
                    <Badge
                      variant={settings?.available_status ? "default" : "secondary"}
                      className="text-[10px] px-2 py-0.5"
                    >
                      {settings?.available_status ? "Open for Work" : "Currently Engaged"}
                    </Badge>
                  </div>
                  {settings?.location && (
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 text-muted-foreground/70" />
                      <span>{settings.location}</span>
                    </p>
                  )}
                  {settings?.email && (
                    <p className="text-xs font-mono text-muted-foreground/80 truncate">
                      {settings.email}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* ========================================================================= */}
        {/* CARD 2: Hero & Biography */}
        {/* ========================================================================= */}
        <Card className="flex flex-col justify-between">
          <div>
            <CardHeader className="flex flex-row items-start justify-between pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">Hero & Biography</CardTitle>
                  <CardDescription className="text-xs">
                    Homepage headline, subheadline, and detailed about bio.
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="cursor-target shrink-0 gap-1.5"
                onClick={() => setActiveModal("hero")}
              >
                <Pencil className="h-3.5 w-3.5" />
                <span>Edit Hero & Bio</span>
              </Button>
            </CardHeader>

            <CardContent className="space-y-3.5 pt-2">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Hero Headline
                </span>
                <p className="text-sm font-medium text-foreground line-clamp-2">
                  {settings?.hero_headline || "—"}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Hero Subheadline
                </span>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {settings?.hero_subheadline || "—"}
                </p>
              </div>

              <div className="space-y-1 rounded-lg border border-border/40 bg-muted/20 p-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  About Bio Preview
                </span>
                <p className="text-xs text-muted-foreground/90 line-clamp-3 leading-relaxed">
                  {settings?.about_bio || "—"}
                </p>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* ========================================================================= */}
        {/* CARD 3: Social & Developer Links */}
        {/* ========================================================================= */}
        <Card className="flex flex-col justify-between">
          <div>
            <CardHeader className="flex flex-row items-start justify-between pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <Share2 className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">Social & Developer Accounts</CardTitle>
                  <CardDescription className="text-xs">
                    GitHub, LinkedIn, Facebook, and contact coordinates.
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="cursor-target shrink-0 gap-1.5"
                onClick={() => setActiveModal("social")}
              >
                <Pencil className="h-3.5 w-3.5" />
                <span>Edit Links</span>
              </Button>
            </CardHeader>

            <CardContent className="space-y-2.5 pt-2">
              {/* GitHub */}
              <div className="flex items-center justify-between gap-3 rounded-lg border border-border/40 bg-muted/20 px-3 py-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <Github className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="font-medium text-foreground truncate">
                    {settings?.github_username ? `@${settings.github_username}` : "GitHub"}
                  </span>
                </div>
                {settings?.github_url ? (
                  <a
                    href={settings.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <span>Visit</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-muted-foreground/60">Not set</span>
                )}
              </div>

              {/* LinkedIn */}
              <div className="flex items-center justify-between gap-3 rounded-lg border border-border/40 bg-muted/20 px-3 py-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <Linkedin className="h-4 w-4 text-sky-400 shrink-0" />
                  <span className="font-medium text-foreground">LinkedIn</span>
                </div>
                {settings?.linkedin_url ? (
                  <a
                    href={settings.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <span>Visit</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-muted-foreground/60">Not set</span>
                )}
              </div>

              {/* Facebook */}
              <div className="flex items-center justify-between gap-3 rounded-lg border border-border/40 bg-muted/20 px-3 py-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <Facebook className="h-4 w-4 text-blue-500 shrink-0" />
                  <span className="font-medium text-foreground">Facebook</span>
                </div>
                {settings?.facebook_url ? (
                  <a
                    href={settings.facebook_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <span>Visit</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-muted-foreground/60">Not set</span>
                )}
              </div>

              {/* Email */}
              <div className="flex items-center justify-between gap-3 rounded-lg border border-border/40 bg-muted/20 px-3 py-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="font-medium text-foreground truncate">
                    {settings?.email || "Email"}
                  </span>
                </div>
                {settings?.email && (
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Send Mail
                  </a>
                )}
              </div>
            </CardContent>
          </div>
        </Card>

        {/* ========================================================================= */}
        {/* CARD 4: Resume & Documents */}
        {/* ========================================================================= */}
        <Card className="flex flex-col justify-between">
          <div>
            <CardHeader className="flex flex-row items-start justify-between pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">Resume & Documents</CardTitle>
                  <CardDescription className="text-xs">
                    PDF document served to recruiters and visitors across the site.
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="cursor-target shrink-0 gap-1.5"
                onClick={() => setActiveModal("resume")}
              >
                <FileUp className="h-3.5 w-3.5" />
                <span>Update Resume</span>
              </Button>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              <div className="flex items-center justify-between gap-4 rounded-xl border border-border/50 bg-muted/20 p-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">
                      {settings?.resume_url ? "Curriculum Vitae (PDF)" : "No Resume Uploaded"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {settings?.resume_url
                        ? "Active on header download & public links"
                        : "Upload a PDF to activate resume buttons"}
                    </p>
                  </div>
                </div>

                {settings?.resume_url && (
                  <Button asChild variant="outline" size="sm" className="shrink-0 gap-1.5 cursor-target">
                    <a href={settings.resume_url} target="_blank" rel="noreferrer">
                      <Eye className="h-3.5 w-3.5" />
                      <span>Preview</span>
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </div>
        </Card>

        {/* ========================================================================= */}
        {/* CARD 5: SEO & Search Optimization */}
        {/* ========================================================================= */}
        <Card className="flex flex-col justify-between">
          <div>
            <CardHeader className="flex flex-row items-start justify-between pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Search className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">SEO & Search Engine Preview</CardTitle>
                  <CardDescription className="text-xs">
                    Live simulation of your website in Google Search results.
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="cursor-target shrink-0 gap-1.5"
                onClick={() => setActiveModal("seo")}
              >
                <Pencil className="h-3.5 w-3.5" />
                <span>Edit SEO</span>
              </Button>
            </CardHeader>

            <CardContent className="space-y-3 pt-2">
              {/* Google SERP Snippet Box */}
              <div className="rounded-xl border border-border/50 bg-muted/30 p-4 space-y-1 font-sans">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-white">
                    G
                  </span>
                  <span className="truncate">https://kaiumallimon.tech</span>
                </div>
                <h4 className="text-sm font-medium text-blue-400 hover:underline cursor-pointer truncate">
                  {settings?.seo_title || "Kaium Al Limon | Full-Stack Developer"}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {settings?.seo_description ||
                    "Personal portfolio of Kaium Al Limon, a Full-Stack Developer specializing in Flutter & Next.js."}
                </p>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* ========================================================================= */}
        {/* CARD 6: Footer & Branding */}
        {/* ========================================================================= */}
        <Card className="flex flex-col justify-between">
          <div>
            <CardHeader className="flex flex-row items-start justify-between pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
                  <PanelBottom className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">Footer & Global Signature</CardTitle>
                  <CardDescription className="text-xs">
                    Closing bio note and footer copy shown across all pages.
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="cursor-target shrink-0 gap-1.5"
                onClick={() => setActiveModal("footer")}
              >
                <Pencil className="h-3.5 w-3.5" />
                <span>Edit Footer</span>
              </Button>
            </CardHeader>

            <CardContent className="space-y-3 pt-2">
              <div className="rounded-lg border border-border/40 bg-muted/20 p-3 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Footer Description
                </span>
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {settings?.footer_description || "—"}
                </p>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: Profile & Identity */}
      {/* ========================================================================= */}
      <Dialog open={activeModal === "profile"} onOpenChange={(o) => !o && setActiveModal(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Profile & Identity</DialogTitle>
            <DialogDescription>
              Update your primary display name, avatar, location, and availability badge.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <TextField
              label="Display Name"
              name="display_name"
              defaultValue={settings?.display_name}
              placeholder="e.g. Kaium Al Limon"
              required
            />
            <TextField
              label="Location"
              name="location"
              defaultValue={settings?.location}
              placeholder="e.g. Dhaka, Bangladesh"
            />
            <input type="hidden" name="available_status_present" value="1" />
            <SwitchField
              label="Available for Work / Hire"
              name="available_status"
              defaultChecked={settings?.available_status}
            />
            <ImageUploader
              label="Profile Photo / Avatar"
              name="profile_image"
              bucket="portfolio-media"
              defaultValue={settings?.profile_image}
            />
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setActiveModal(null)} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 2: Hero & Biography */}
      {/* ========================================================================= */}
      <Dialog open={activeModal === "hero"} onOpenChange={(o) => !o && setActiveModal(null)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Hero & Biography</DialogTitle>
            <DialogDescription>
              Update the prominent headline, subheadline, and detailed about bio.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <TextAreaField
              label="Hero Headline"
              name="hero_headline"
              defaultValue={settings?.hero_headline}
              placeholder="e.g. Building Scalable Web & Mobile Architectures"
              rows={2}
            />
            <TextAreaField
              label="Hero Subheadline"
              name="hero_subheadline"
              defaultValue={settings?.hero_subheadline}
              placeholder="e.g. Full-Stack Engineer specializing in Flutter & Next.js"
              rows={2}
            />
            <TextAreaField
              label="About Bio (separate paragraphs with blank lines)"
              name="about_bio"
              defaultValue={settings?.about_bio}
              placeholder="Write your personal story, technical passions, and background..."
              rows={6}
            />
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setActiveModal(null)} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 3: Social & Developer Accounts */}
      {/* ========================================================================= */}
      <Dialog open={activeModal === "social"} onOpenChange={(o) => !o && setActiveModal(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Social & Developer Accounts</DialogTitle>
            <DialogDescription>
              Configure profile URLs for GitHub, LinkedIn, Facebook, and public contact email.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <TextField
              label="GitHub Profile URL"
              name="github_url"
              defaultValue={settings?.github_url}
              placeholder="https://github.com/username"
            />
            <TextField
              label="GitHub Username (used for live statistics widget)"
              name="github_username"
              defaultValue={settings?.github_username}
              placeholder="e.g. kaiumallimon"
            />
            <TextField
              label="LinkedIn Profile URL"
              name="linkedin_url"
              defaultValue={settings?.linkedin_url}
              placeholder="https://linkedin.com/in/username"
            />
            <TextField
              label="Facebook Profile URL"
              name="facebook_url"
              defaultValue={settings?.facebook_url}
              placeholder="https://facebook.com/username"
            />
            <TextField
              label="Public Contact Email"
              name="email"
              defaultValue={settings?.email}
              placeholder="youremail@domain.com"
            />
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setActiveModal(null)} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 4: Resume & Documents */}
      {/* ========================================================================= */}
      <Dialog open={activeModal === "resume"} onOpenChange={(o) => !o && setActiveModal(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Update Resume PDF</DialogTitle>
            <DialogDescription>
              Upload a new PDF file. It will automatically update all download buttons across the site.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <FileUploader
              label="Resume PDF Document"
              name="resume_url"
              bucket="resumes"
              defaultValue={settings?.resume_url}
            />
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setActiveModal(null)} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Resume"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 5: SEO & Metadata */}
      {/* ========================================================================= */}
      <Dialog open={activeModal === "seo"} onOpenChange={(o) => !o && setActiveModal(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit SEO & Search Metadata</DialogTitle>
            <DialogDescription>
              Configure meta tags used by Google, Twitter, LinkedIn, and social media scrapers.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <TextField
              label="SEO Title"
              name="seo_title"
              defaultValue={settings?.seo_title}
              placeholder="e.g. Kaium Al Limon | Full-Stack Developer"
            />
            <TextAreaField
              label="SEO Description"
              name="seo_description"
              defaultValue={settings?.seo_description}
              placeholder="Compelling 150-160 character description of your skills and background..."
              rows={4}
            />
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setActiveModal(null)} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save SEO Metadata"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 6: Footer & Global Signature */}
      {/* ========================================================================= */}
      <Dialog open={activeModal === "footer"} onOpenChange={(o) => !o && setActiveModal(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Footer Copy</DialogTitle>
            <DialogDescription>
              Update the footer description and summary shown at the bottom of the page.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <TextAreaField
              label="Footer Description"
              name="footer_description"
              defaultValue={settings?.footer_description}
              placeholder="Short closing statement or signature for the footer..."
              rows={4}
            />
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setActiveModal(null)} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Footer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
