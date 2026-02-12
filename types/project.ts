export type Project = {
  id: string;
  name: string | null;
  short_details: string | null;
  github_url: string | null;
  // technologies: string[] | null; // Changed to array for easier handling
  overview: string | null;
  features: string | null;
  conclusion: string | null;
  created_at: string;
  live_url: string | null;
  client: 'mobile' | 'web' | null; // Added client field
};
