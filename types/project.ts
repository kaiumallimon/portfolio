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
