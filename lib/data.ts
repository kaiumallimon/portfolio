import { getServerSupabase } from "@/lib/supabase/server";
import type {
  Achievement,
  Activity,
  ContactMessage,
  Education,
  Hobby,
  Metric,
  Project,
  SiteSettings,
  SkillCategory,
} from "@/types/content";

// All fetchers use the service-role server client and fail soft (empty data)
// so the site still renders if the database is unreachable.

async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error("[data] fetch failed:", err);
    return fallback;
  }
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return safeQuery(async () => {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (error) throw error;
    return (data as SiteSettings) ?? null;
  }, null);
}

export async function getProjects(): Promise<Project[]> {
  return safeQuery(async () => {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("order", { ascending: true });
    if (error) throw error;
    return (data as Project[]) ?? [];
  }, []);
}

export async function getProjectsPaginated({
  page = 1,
  size = 15,
  q = "",
  client = "all",
}: {
  page?: number;
  size?: number;
  q?: string;
  client?: string;
}): Promise<{ projects: Project[]; total: number }> {
  return safeQuery(async () => {
    const supabase = getServerSupabase();
    const from = (page - 1) * size;
    const to = from + size - 1;

    let query = supabase
      .from("projects")
      .select("*", { count: "exact" })
      .order("order", { ascending: true });

    if (client && client !== "all") {
      query = query.eq("client", client);
    }

    const term = q.trim();
    if (term) {
      const like = `%${term}%`;
      query = query.or(`name.ilike.${like},short_details.ilike.${like}`);
    }

    const { data, error, count } = await query.range(from, to);
    if (error) throw error;
    return { projects: (data as Project[]) ?? [], total: count ?? 0 };
  }, { projects: [], total: 0 });
}

export async function getProjectById(id: string): Promise<Project | null> {
  return safeQuery(async () => {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return (data as Project) ?? null;
  }, null);
}

export async function getAchievements(): Promise<Achievement[]> {
  return safeQuery(async () => {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .order("order", { ascending: true });
    if (error) throw error;
    return (data as Achievement[]) ?? [];
  }, []);
}

export async function getActivities(): Promise<Activity[]> {
  return safeQuery(async () => {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .order("order", { ascending: true });
    if (error) throw error;
    return (data as Activity[]) ?? [];
  }, []);
}

export async function getEducation(): Promise<Education[]> {
  return safeQuery(async () => {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("education")
      .select("*")
      .order("order", { ascending: true });
    if (error) throw error;
    return (data as Education[]) ?? [];
  }, []);
}

export async function getSkills(): Promise<SkillCategory[]> {
  return safeQuery(async () => {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("order", { ascending: true });
    if (error) throw error;
    return (data as SkillCategory[]) ?? [];
  }, []);
}

export async function getHobbies(): Promise<Hobby[]> {
  return safeQuery(async () => {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("hobbies")
      .select("*")
      .order("order", { ascending: true });
    if (error) throw error;
    return (data as Hobby[]) ?? [];
  }, []);
}

export async function getMetrics(): Promise<Metric[]> {
  return safeQuery(async () => {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("metrics")
      .select("*")
      .order("order", { ascending: true });
    if (error) throw error;
    return (data as Metric[]) ?? [];
  }, []);
}

export async function getResumeUrl(): Promise<string | null> {
  return safeQuery(async () => {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("resume")
      .select("resume_url")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return (data?.resume_url as string) ?? null;
  }, null);
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[data] contact messages fetch failed:", error);
    return [];
  }
  return (data as ContactMessage[]) ?? [];
}
