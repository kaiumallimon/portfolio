"use server";

import { revalidatePath } from "next/cache";
import { getServerSupabase } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/guard";
import { getAuthServerClient } from "@/lib/supabase/auth";
import { logSystemActivity } from "@/lib/audit";

// ---------------------------------------------------------------------------
// Secure Server-Side Login & Telemetry Action
// ---------------------------------------------------------------------------
export async function loginAdminAction(
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const email = str(formData, "email");
  const password = str(formData, "password");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await getAuthServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Server-verified failed authentication attempt
    await logSystemActivity({
      type: "login_failed",
      action: "Admin Login Failed",
      entity: "auth",
      status: "failure",
      userEmail: email,
      metadata: { reason: error.message },
    });
    return { error: error.message };
  }

  // Server-verified authentic login success
  await logSystemActivity({
    type: "login_success",
    action: "Admin Login Succeeded",
    entity: "auth",
    status: "success",
    userEmail: email,
    metadata: { userId: data.user.id },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/system-activity");
  return { success: true };
}

// Allowed MIME types and max size (5MB) for uploaded files
const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

// ---------------------------------------------------------------------------
// Storage upload (called from client ImageUploader)
// ---------------------------------------------------------------------------
export async function uploadImage(formData: FormData): Promise<{ url: string | null; error?: string }> {
  const admin = await requireAdmin();

  const bucket = formData.get("bucket") as string;
  const file = formData.get("file") as File | null;
  if (!bucket || !file) return { url: null, error: "Missing bucket or file" };

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { url: null, error: "File exceeds 5MB maximum limit." };
  }

  if (file.type && !ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    return { url: null, error: "Unsupported file format." };
  }

  const supabase = getServerSupabase();
  const ext = (file.name.split(".").pop() || "png").split("?")[0];
  const safeExt = ["png", "jpg", "jpeg", "gif", "webp", "svg", "pdf"].includes(ext.toLowerCase())
    ? ext.toLowerCase()
    : "png";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${safeExt}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    contentType: file.type || undefined,
  });
  if (error) return { url: null, error: error.message };

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  // Track write activity
  await logSystemActivity({
    type: "upload",
    action: `Uploaded asset to ${bucket}`,
    entity: "storage",
    userEmail: admin.email,
    metadata: { bucket, path, fileName: file.name, fileSize: file.size, fileType: file.type },
  });

  return { url: data.publicUrl };
}

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------
function str(formData: FormData, key: string): string | null {
  const v = formData.get(key);
  if (v === null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}

function num(formData: FormData, key: string): number {
  const v = formData.get(key);
  if (v === null) return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function bool(formData: FormData, key: string): boolean {
  const v = formData.get(key);
  return v === "on" || v === "true" || v === "1";
}

function csv(formData: FormData, key: string): string[] | null {
  const v = str(formData, key);
  if (!v) return null;
  const arr = v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return arr.length ? arr : null;
}

function revalidateAll() {
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/projects");
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
export async function saveProject(formData: FormData) {
  const admin = await requireAdmin();
  const supabase = getServerSupabase();
  const id = str(formData, "id");

  const imagesRaw = str(formData, "images");
  let images: string[] | null = null;
  if (imagesRaw) {
    try {
      const parsed = JSON.parse(imagesRaw);
      if (Array.isArray(parsed)) images = parsed.map(String).filter(Boolean);
    } catch {
      images = null;
    }
  }

  const payload = {
    name: str(formData, "name"),
    short_details: str(formData, "short_details"),
    github_url: str(formData, "github_url"),
    live_url: str(formData, "live_url"),
    client: str(formData, "client"),
    technologies: csv(formData, "technologies"),
    image: images?.[0] ?? null,
    images,
    order: num(formData, "order"),
    featured: bool(formData, "featured"),
    is_mobile: bool(formData, "is_mobile"),
  };

  if (id) {
    await supabase.from("projects").update(payload).eq("id", id);
    await logSystemActivity({
      type: "update",
      action: `Updated Project: ${payload.name || id}`,
      entity: "projects",
      entityId: id,
      userEmail: admin.email,
      metadata: { name: payload.name, technologies: payload.technologies },
    });
  } else {
    const { data } = await supabase.from("projects").insert(payload).select("id").single();
    await logSystemActivity({
      type: "create",
      action: `Created Project: ${payload.name || "New"}`,
      entity: "projects",
      entityId: data?.id,
      userEmail: admin.email,
      metadata: { name: payload.name, technologies: payload.technologies },
    });
  }
  revalidateAll();
  revalidatePath("/admin/projects");
  revalidatePath("/admin/system-activity");
}

export async function deleteProject(formData: FormData) {
  const admin = await requireAdmin();
  const supabase = getServerSupabase();
  const id = str(formData, "id");
  if (id) {
    await supabase.from("projects").delete().eq("id", id);
    await logSystemActivity({
      type: "delete",
      action: `Deleted Project (ID: ${id})`,
      entity: "projects",
      entityId: id,
      userEmail: admin.email,
    });
  }
  revalidateAll();
  revalidatePath("/admin/projects");
  revalidatePath("/admin/system-activity");
}

// ---------------------------------------------------------------------------
// Achievements
// ---------------------------------------------------------------------------
export async function saveAchievement(formData: FormData) {
  const admin = await requireAdmin();
  const supabase = getServerSupabase();
  const id = str(formData, "id");
  const payload = {
    title: str(formData, "title") ?? "",
    award: str(formData, "award") ?? "",
    award_rank: str(formData, "award_rank") ?? "other",
    date: str(formData, "date"),
    project: str(formData, "project"),
    team: str(formData, "team"),
    image: str(formData, "image"),
    order: num(formData, "order"),
  };
  if (id) {
    await supabase.from("achievements").update(payload).eq("id", id);
    await logSystemActivity({
      type: "update",
      action: `Updated Achievement: ${payload.title}`,
      entity: "achievements",
      entityId: id,
      userEmail: admin.email,
      metadata: { title: payload.title, award: payload.award },
    });
  } else {
    const { data } = await supabase.from("achievements").insert(payload).select("id").single();
    await logSystemActivity({
      type: "create",
      action: `Created Achievement: ${payload.title}`,
      entity: "achievements",
      entityId: data?.id,
      userEmail: admin.email,
      metadata: { title: payload.title, award: payload.award },
    });
  }
  revalidateAll();
  revalidatePath("/admin/achievements");
  revalidatePath("/admin/system-activity");
}

export async function deleteAchievement(formData: FormData) {
  const admin = await requireAdmin();
  const supabase = getServerSupabase();
  const id = str(formData, "id");
  if (id) {
    await supabase.from("achievements").delete().eq("id", id);
    await logSystemActivity({
      type: "delete",
      action: `Deleted Achievement (ID: ${id})`,
      entity: "achievements",
      entityId: id,
      userEmail: admin.email,
    });
  }
  revalidateAll();
  revalidatePath("/admin/achievements");
  revalidatePath("/admin/system-activity");
}

// ---------------------------------------------------------------------------
// Activities
// ---------------------------------------------------------------------------
export async function saveActivity(formData: FormData) {
  const admin = await requireAdmin();
  const supabase = getServerSupabase();
  const id = str(formData, "id");
  const payload = {
    title: str(formData, "title") ?? "",
    organization: str(formData, "organization"),
    period: str(formData, "period"),
    active: bool(formData, "active"),
    order: num(formData, "order"),
  };
  if (id) {
    await supabase.from("activities").update(payload).eq("id", id);
    await logSystemActivity({
      type: "update",
      action: `Updated Activity: ${payload.title}`,
      entity: "activities",
      entityId: id,
      userEmail: admin.email,
      metadata: { title: payload.title, organization: payload.organization },
    });
  } else {
    const { data } = await supabase.from("activities").insert(payload).select("id").single();
    await logSystemActivity({
      type: "create",
      action: `Created Activity: ${payload.title}`,
      entity: "activities",
      entityId: data?.id,
      userEmail: admin.email,
      metadata: { title: payload.title, organization: payload.organization },
    });
  }
  revalidateAll();
  revalidatePath("/admin/activities");
  revalidatePath("/admin/system-activity");
}

export async function deleteActivity(formData: FormData) {
  const admin = await requireAdmin();
  const supabase = getServerSupabase();
  const id = str(formData, "id");
  if (id) {
    await supabase.from("activities").delete().eq("id", id);
    await logSystemActivity({
      type: "delete",
      action: `Deleted Activity (ID: ${id})`,
      entity: "activities",
      entityId: id,
      userEmail: admin.email,
    });
  }
  revalidateAll();
  revalidatePath("/admin/activities");
  revalidatePath("/admin/system-activity");
}

// ---------------------------------------------------------------------------
// Education
// ---------------------------------------------------------------------------
export async function saveEducation(formData: FormData) {
  const admin = await requireAdmin();
  const supabase = getServerSupabase();
  const id = str(formData, "id");
  const payload = {
    degree: str(formData, "degree") ?? "",
    institution: str(formData, "institution"),
    period: str(formData, "period"),
    description: str(formData, "description"),
    status: str(formData, "status") ?? "completed",
    order: num(formData, "order"),
  };
  if (id) {
    await supabase.from("education").update(payload).eq("id", id);
    await logSystemActivity({
      type: "update",
      action: `Updated Education: ${payload.degree}`,
      entity: "education",
      entityId: id,
      userEmail: admin.email,
      metadata: { degree: payload.degree, institution: payload.institution },
    });
  } else {
    const { data } = await supabase.from("education").insert(payload).select("id").single();
    await logSystemActivity({
      type: "create",
      action: `Created Education: ${payload.degree}`,
      entity: "education",
      entityId: data?.id,
      userEmail: admin.email,
      metadata: { degree: payload.degree, institution: payload.institution },
    });
  }
  revalidateAll();
  revalidatePath("/admin/education");
  revalidatePath("/admin/system-activity");
}

export async function deleteEducation(formData: FormData) {
  const admin = await requireAdmin();
  const supabase = getServerSupabase();
  const id = str(formData, "id");
  if (id) {
    await supabase.from("education").delete().eq("id", id);
    await logSystemActivity({
      type: "delete",
      action: `Deleted Education (ID: ${id})`,
      entity: "education",
      entityId: id,
      userEmail: admin.email,
    });
  }
  revalidateAll();
  revalidatePath("/admin/education");
  revalidatePath("/admin/system-activity");
}

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------
export async function saveSkill(formData: FormData) {
  const admin = await requireAdmin();
  const supabase = getServerSupabase();
  const id = str(formData, "id");
  const skillsJson = str(formData, "skills_json");
  let skills: { name: string; highlight: boolean }[] = [];
  if (skillsJson) {
    try {
      const parsed = JSON.parse(skillsJson);
      if (Array.isArray(parsed)) skills = parsed;
    } catch {
      skills = [];
    }
  }
  const payload = {
    category: str(formData, "category") ?? "",
    icon: str(formData, "icon"),
    skills,
    order: num(formData, "order"),
  };
  if (id) {
    await supabase.from("skills").update(payload).eq("id", id);
    await logSystemActivity({
      type: "update",
      action: `Updated Skill Category: ${payload.category}`,
      entity: "skills",
      entityId: id,
      userEmail: admin.email,
      metadata: { category: payload.category, count: skills.length },
    });
  } else {
    const { data } = await supabase.from("skills").insert(payload).select("id").single();
    await logSystemActivity({
      type: "create",
      action: `Created Skill Category: ${payload.category}`,
      entity: "skills",
      entityId: data?.id,
      userEmail: admin.email,
      metadata: { category: payload.category, count: skills.length },
    });
  }
  revalidateAll();
  revalidatePath("/admin/skills");
  revalidatePath("/admin/system-activity");
}

export async function deleteSkill(formData: FormData) {
  const admin = await requireAdmin();
  const supabase = getServerSupabase();
  const id = str(formData, "id");
  if (id) {
    await supabase.from("skills").delete().eq("id", id);
    await logSystemActivity({
      type: "delete",
      action: `Deleted Skill Category (ID: ${id})`,
      entity: "skills",
      entityId: id,
      userEmail: admin.email,
    });
  }
  revalidateAll();
  revalidatePath("/admin/skills");
  revalidatePath("/admin/system-activity");
}

// ---------------------------------------------------------------------------
// Hobbies
// ---------------------------------------------------------------------------
export async function saveHobby(formData: FormData) {
  const admin = await requireAdmin();
  const supabase = getServerSupabase();
  const id = str(formData, "id");
  const payload = {
    title: str(formData, "title") ?? "",
    description: str(formData, "description"),
    icon: str(formData, "icon"),
    order: num(formData, "order"),
  };
  if (id) {
    await supabase.from("hobbies").update(payload).eq("id", id);
    await logSystemActivity({
      type: "update",
      action: `Updated Hobby: ${payload.title}`,
      entity: "hobbies",
      entityId: id,
      userEmail: admin.email,
      metadata: { title: payload.title },
    });
  } else {
    const { data } = await supabase.from("hobbies").insert(payload).select("id").single();
    await logSystemActivity({
      type: "create",
      action: `Created Hobby: ${payload.title}`,
      entity: "hobbies",
      entityId: data?.id,
      userEmail: admin.email,
      metadata: { title: payload.title },
    });
  }
  revalidateAll();
  revalidatePath("/admin/hobbies");
  revalidatePath("/admin/system-activity");
}

export async function deleteHobby(formData: FormData) {
  const admin = await requireAdmin();
  const supabase = getServerSupabase();
  const id = str(formData, "id");
  if (id) {
    await supabase.from("hobbies").delete().eq("id", id);
    await logSystemActivity({
      type: "delete",
      action: `Deleted Hobby (ID: ${id})`,
      entity: "hobbies",
      entityId: id,
      userEmail: admin.email,
    });
  }
  revalidateAll();
  revalidatePath("/admin/hobbies");
  revalidatePath("/admin/system-activity");
}

// ---------------------------------------------------------------------------
// Metrics
// ---------------------------------------------------------------------------
export async function saveMetric(formData: FormData) {
  const admin = await requireAdmin();
  const supabase = getServerSupabase();
  const id = str(formData, "id");
  const payload = {
    label: str(formData, "label") ?? "",
    value: num(formData, "value"),
    suffix: str(formData, "suffix"),
    icon: str(formData, "icon"),
    featured: bool(formData, "featured"),
    order: num(formData, "order"),
  };
  if (id) {
    await supabase.from("metrics").update(payload).eq("id", id);
    await logSystemActivity({
      type: "update",
      action: `Updated Metric: ${payload.label}`,
      entity: "metrics",
      entityId: id,
      userEmail: admin.email,
      metadata: { label: payload.label, value: payload.value },
    });
  } else {
    const { data } = await supabase.from("metrics").insert(payload).select("id").single();
    await logSystemActivity({
      type: "create",
      action: `Created Metric: ${payload.label}`,
      entity: "metrics",
      entityId: data?.id,
      userEmail: admin.email,
      metadata: { label: payload.label, value: payload.value },
    });
  }
  revalidateAll();
  revalidatePath("/admin/metrics");
  revalidatePath("/admin/system-activity");
}

export async function deleteMetric(formData: FormData) {
  const admin = await requireAdmin();
  const supabase = getServerSupabase();
  const id = str(formData, "id");
  if (id) {
    await supabase.from("metrics").delete().eq("id", id);
    await logSystemActivity({
      type: "delete",
      action: `Deleted Metric (ID: ${id})`,
      entity: "metrics",
      entityId: id,
      userEmail: admin.email,
    });
  }
  revalidateAll();
  revalidatePath("/admin/metrics");
  revalidatePath("/admin/system-activity");
}

// ---------------------------------------------------------------------------
// Settings (singleton)
// ---------------------------------------------------------------------------
export async function saveSettings(formData: FormData) {
  const admin = await requireAdmin();
  const supabase = getServerSupabase();

  // Fetch current settings first so card-specific partial updates preserve untouched fields!
  const { data: existing } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();

  const payload: Record<string, any> = {
    id: 1,
    display_name: formData.has("display_name") ? str(formData, "display_name") : existing?.display_name,
    hero_headline: formData.has("hero_headline") ? str(formData, "hero_headline") : existing?.hero_headline,
    hero_subheadline: formData.has("hero_subheadline") ? str(formData, "hero_subheadline") : existing?.hero_subheadline,
    about_bio: formData.has("about_bio") ? str(formData, "about_bio") : existing?.about_bio,
    available_status: formData.has("available_status_present")
      ? bool(formData, "available_status")
      : formData.has("available_status")
      ? bool(formData, "available_status")
      : (existing?.available_status ?? true),
    profile_image: formData.has("profile_image") ? str(formData, "profile_image") : existing?.profile_image,
    github_url: formData.has("github_url") ? str(formData, "github_url") : existing?.github_url,
    linkedin_url: formData.has("linkedin_url") ? str(formData, "linkedin_url") : existing?.linkedin_url,
    facebook_url: formData.has("facebook_url") ? str(formData, "facebook_url") : existing?.facebook_url,
    email: formData.has("email") ? str(formData, "email") : existing?.email,
    location: formData.has("location") ? str(formData, "location") : existing?.location,
    github_username: formData.has("github_username") ? str(formData, "github_username") : existing?.github_username,
    resume_url: formData.has("resume_url") ? str(formData, "resume_url") : existing?.resume_url,
    seo_title: formData.has("seo_title") ? str(formData, "seo_title") : existing?.seo_title,
    seo_description: formData.has("seo_description") ? str(formData, "seo_description") : existing?.seo_description,
    footer_description: formData.has("footer_description") ? str(formData, "footer_description") : existing?.footer_description,
  };
  await supabase.from("site_settings").upsert(payload);

  // Keep the `resume` table as a single entry and clean up the old file in
  // storage when a new resume is uploaded.
  const resumeUrl = str(formData, "resume_url");
  if (resumeUrl) {
    const { data: rows } = await supabase.from("resume").select("resume_url");
    const stale = (rows ?? [])
      .map((r) => r.resume_url)
      .filter((u): u is string => Boolean(u) && u !== resumeUrl);
    for (const u of stale) {
      const m = /\/public\/resumes\/(.+)$/.exec(u);
      if (m) await supabase.storage.from("resumes").remove([m[1]]).catch(() => {});
    }
    await supabase.from("resume").delete();
    await supabase.from("resume").insert({ resume_url: resumeUrl });
  }

  await logSystemActivity({
    type: "settings_update",
    action: "Updated Portfolio Site Settings",
    entity: "settings",
    entityId: "1",
    userEmail: admin.email,
    metadata: {
      display_name: payload.display_name,
      available_status: payload.available_status,
      hero_headline: payload.hero_headline,
    },
  });

  revalidateAll();
  revalidatePath("/admin/settings");
  revalidatePath("/admin/system-activity");
}

// ---------------------------------------------------------------------------
// Contact messages
// ---------------------------------------------------------------------------
export async function deleteMessage(formData: FormData) {
  const admin = await requireAdmin();
  const supabase = getServerSupabase();
  const id = str(formData, "id");
  if (id) {
    await supabase.from("contact_messages").delete().eq("id", id);
    await logSystemActivity({
      type: "delete",
      action: `Deleted Contact Message (ID: ${id})`,
      entity: "messages",
      entityId: id,
      userEmail: admin.email,
    });
  }
  revalidatePath("/admin/messages");
  revalidatePath("/admin/system-activity");
}

export async function toggleMessageRead(formData: FormData) {
  const admin = await requireAdmin();
  const supabase = getServerSupabase();
  const id = str(formData, "id");
  const read = bool(formData, "read");
  if (id) {
    await supabase.from("contact_messages").update({ read }).eq("id", id);
    await logSystemActivity({
      type: "update",
      action: `${read ? "Marked Read" : "Marked Unread"} Contact Message (ID: ${id})`,
      entity: "messages",
      entityId: id,
      userEmail: admin.email,
      metadata: { read },
    });
  }
  revalidatePath("/admin/messages");
  revalidatePath("/admin/system-activity");
}

export async function markThreadRead(formData: FormData) {
  const admin = await requireAdmin();
  const supabase = getServerSupabase();
  const email = str(formData, "email");
  if (email) {
    await supabase.from("contact_messages").update({ read: true }).eq("email", email);
    await logSystemActivity({
      type: "update",
      action: `Marked Thread Read for ${email}`,
      entity: "messages",
      userEmail: admin.email,
      metadata: { senderEmail: email },
    });
  }
  revalidatePath("/admin/messages");
  revalidatePath("/admin/system-activity");
}

export async function deleteThread(formData: FormData) {
  const admin = await requireAdmin();
  const supabase = getServerSupabase();
  const email = str(formData, "email");
  if (email) {
    await supabase.from("contact_messages").delete().eq("email", email);
    await logSystemActivity({
      type: "delete",
      action: `Deleted Message Thread for ${email}`,
      entity: "messages",
      userEmail: admin.email,
      metadata: { senderEmail: email },
    });
  }
  revalidatePath("/admin/messages");
  revalidatePath("/admin/system-activity");
}
