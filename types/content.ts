export type Project = {
  id: string;
  name: string | null;
  short_details: string | null;
  github_url: string | null;
  live_url: string | null;
  client: "mobile" | "web" | null;
  overview: string | null;
  features: string | null;
  conclusion: string | null;
  technologies: string[] | null;
  image: string | null;
  order: number;
  created_at: string;
};

export type Achievement = {
  id: string;
  title: string;
  award: string;
  award_rank: "champion" | "1st-runner-up" | "2nd-runner-up" | "other";
  date: string | null;
  project: string | null;
  team: string | null;
  image: string | null;
  order: number;
};

export type Activity = {
  id: string;
  title: string;
  organization: string | null;
  period: string | null;
  active: boolean;
  order: number;
};

export type Education = {
  id: string;
  degree: string;
  institution: string | null;
  period: string | null;
  description: string | null;
  status: "current" | "completed";
  order: number;
};

export type SkillItem = { name: string; highlight: boolean };
export type SkillCategory = {
  id: string;
  category: string;
  icon: string | null;
  skills: SkillItem[];
  order: number;
};

export type Hobby = {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  order: number;
};

export type Metric = {
  id: string;
  label: string;
  value: number;
  suffix: string | null;
  icon: string | null;
  featured: boolean;
  order: number;
};

export type SiteSettings = {
  id: number;
  display_name: string | null;
  hero_headline: string | null;
  hero_subheadline: string | null;
  about_bio: string | null;
  available_status: boolean;
  profile_image: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  email: string | null;
  location: string | null;
  github_username: string | null;
  resume_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
};

export type ContactMessage = {
  id: string;
  name: string | null;
  email: string | null;
  message: string | null;
  read: boolean;
  created_at: string;
};
