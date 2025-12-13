import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Project = {
  id: string;
  name: string | null;
  short_details: string | null;
  github_url: string | null;
  technologies: string | null;
  overview: string | null;
  features: string | null;
  conclusion: string | null;
  created_at: string;
  live_url: string | null;
};
