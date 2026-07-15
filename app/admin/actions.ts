"use server";

import { revalidatePath } from "next/cache";
import { getServerSupabase } from "@/lib/supabase/server";

// ---------------------------------------------------------------------------
// Storage upload (called from client ImageUploader)
// ---------------------------------------------------------------------------
export async function uploadImage(formData: FormData): Promise<{ url: string | null; error?: string }> {
  const bucket = formData.get("bucket") as string;
  const file = formData.get("file") as File | null;
  if (!bucket || !file) return { url: null, error: "Missing bucket or file" };

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
  const supabase = getServerSupabase();
  const id = str(formData, "id");
  const payload = {
    name: str(formData, "name"),
    short_details: str(formData, "short_details"),
    github_url: str(formData, "github_url"),
    live_url: str(formData, "live_url"),
    client: str(formData, "client"),
    technologies: csv(formData, "technologies"),
    image: str(formData, "image"),
    order: num(formData, "order"),
  };
  if (id) {
    await supabase.from("projects").update(payload).eq("id", id);
  } else {
    await supabase.from("projects").insert(payload);
  }
  revalidateAll();
  revalidatePath("/admin/projects");
}

export async function deleteProject(formData: FormData) {
  const supabase = getServerSupabase();
  const id = str(formData, "id");
  if (id) await supabase.from("projects").delete().eq("id", id);
  revalidateAll();
  revalidatePath("/admin/projects");
}

// ---------------------------------------------------------------------------
// Achievements
// ---------------------------------------------------------------------------
export async function saveAchievement(formData: FormData) {
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
  } else {
    await supabase.from("achievements").insert(payload);
  }
  revalidateAll();
  revalidatePath("/admin/achievements");
}

export async function deleteAchievement(formData: FormData) {
  const supabase = getServerSupabase();
  const id = str(formData, "id");
  if (id) await supabase.from("achievements").delete().eq("id", id);
  revalidateAll();
  revalidatePath("/admin/achievements");
}

// ---------------------------------------------------------------------------
// Activities
// ---------------------------------------------------------------------------
export async function saveActivity(formData: FormData) {
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
  } else {
    await supabase.from("activities").insert(payload);
  }
  revalidateAll();
  revalidatePath("/admin/activities");
}

export async function deleteActivity(formData: FormData) {
  const supabase = getServerSupabase();
  const id = str(formData, "id");
  if (id) await supabase.from("activities").delete().eq("id", id);
  revalidateAll();
  revalidatePath("/admin/activities");
}

// ---------------------------------------------------------------------------
// Education
// ---------------------------------------------------------------------------
export async function saveEducation(formData: FormData) {
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
  } else {
    await supabase.from("education").insert(payload);
  }
  revalidateAll();
  revalidatePath("/admin/education");
}

export async function deleteEducation(formData: FormData) {
  const supabase = getServerSupabase();
  const id = str(formData, "id");
  if (id) await supabase.from("education").delete().eq("id", id);
  revalidateAll();
  revalidatePath("/admin/education");
}

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------
export async function saveSkill(formData: FormData) {
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
  } else {
    await supabase.from("skills").insert(payload);
  }
  revalidateAll();
  revalidatePath("/admin/skills");
}

export async function deleteSkill(formData: FormData) {
  const supabase = getServerSupabase();
  const id = str(formData, "id");
  if (id) await supabase.from("skills").delete().eq("id", id);
  revalidateAll();
  revalidatePath("/admin/skills");
}

// ---------------------------------------------------------------------------
// Hobbies
// ---------------------------------------------------------------------------
export async function saveHobby(formData: FormData) {
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
  } else {
    await supabase.from("hobbies").insert(payload);
  }
  revalidateAll();
  revalidatePath("/admin/hobbies");
}

export async function deleteHobby(formData: FormData) {
  const supabase = getServerSupabase();
  const id = str(formData, "id");
  if (id) await supabase.from("hobbies").delete().eq("id", id);
  revalidateAll();
  revalidatePath("/admin/hobbies");
}

// ---------------------------------------------------------------------------
// Metrics
// ---------------------------------------------------------------------------
export async function saveMetric(formData: FormData) {
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
  } else {
    await supabase.from("metrics").insert(payload);
  }
  revalidateAll();
  revalidatePath("/admin/metrics");
}

export async function deleteMetric(formData: FormData) {
  const supabase = getServerSupabase();
  const id = str(formData, "id");
  if (id) await supabase.from("metrics").delete().eq("id", id);
  revalidateAll();
  revalidatePath("/admin/metrics");
}

// ---------------------------------------------------------------------------
// Settings (singleton)
// ---------------------------------------------------------------------------
export async function saveSettings(formData: FormData) {
  const supabase = getServerSupabase();
  const payload = {
    id: 1,
    display_name: str(formData, "display_name"),
    hero_headline: str(formData, "hero_headline"),
    hero_subheadline: str(formData, "hero_subheadline"),
    about_bio: str(formData, "about_bio"),
    available_status: bool(formData, "available_status"),
    profile_image: str(formData, "profile_image"),
    github_url: str(formData, "github_url"),
    linkedin_url: str(formData, "linkedin_url"),
    email: str(formData, "email"),
    location: str(formData, "location"),
    github_username: str(formData, "github_username"),
    resume_url: str(formData, "resume_url"),
    seo_title: str(formData, "seo_title"),
    seo_description: str(formData, "seo_description"),
    footer_description: str(formData, "footer_description"),
    facebook_url: str(formData, "facebook_url"),
  };
  await supabase.from("site_settings").upsert(payload);
  revalidateAll();
  revalidatePath("/admin/settings");
}

// ---------------------------------------------------------------------------
// Contact messages
// ---------------------------------------------------------------------------
export async function deleteMessage(formData: FormData) {
  const supabase = getServerSupabase();
  const id = str(formData, "id");
  if (id) await supabase.from("contact_messages").delete().eq("id", id);
  revalidatePath("/admin/messages");
}

export async function toggleMessageRead(formData: FormData) {
  const supabase = getServerSupabase();
  const id = str(formData, "id");
  const read = bool(formData, "read");
  if (id) await supabase.from("contact_messages").update({ read }).eq("id", id);
  revalidatePath("/admin/messages");
}

export async function markThreadRead(formData: FormData) {
  const supabase = getServerSupabase();
  const email = str(formData, "email");
  if (email) await supabase.from("contact_messages").update({ read: true }).eq("email", email);
  revalidatePath("/admin/messages");
}

export async function deleteThread(formData: FormData) {
  const supabase = getServerSupabase();
  const email = str(formData, "email");
  if (email) await supabase.from("contact_messages").delete().eq("email", email);
  revalidatePath("/admin/messages");
}
