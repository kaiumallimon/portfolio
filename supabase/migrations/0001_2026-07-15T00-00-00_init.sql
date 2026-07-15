-- ============================================================================
-- 0001_2026-07-15T00-00-00_init.sql
-- Portfolio schema: tables, RLS, storage buckets & policies
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Extend existing `projects` table (keep existing data)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  short_details text,
  github_url text,
  live_url text,
  client text CHECK (client IN ('mobile', 'web')),
  overview text,
  features text,
  conclusion text,
  "order" int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE IF EXISTS projects ADD COLUMN IF NOT EXISTS "order" int DEFAULT 0;
ALTER TABLE IF EXISTS projects ADD COLUMN IF NOT EXISTS image text;

-- Convert legacy `technologies` text column -> text[] (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'technologies'
  ) THEN
    ALTER TABLE projects ADD COLUMN technologies text[];
  ELSIF (
    SELECT data_type FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'technologies'
  ) = 'text' THEN
    ALTER TABLE projects ADD COLUMN technologies_new text[];
    UPDATE projects
      SET technologies_new = CASE
        WHEN technologies IS NULL OR technologies = '' THEN ARRAY[]::text[]
        ELSE string_to_array(technologies, ',')
      END;
    ALTER TABLE projects DROP COLUMN technologies;
    ALTER TABLE projects RENAME COLUMN technologies_new TO technologies;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- Extend existing `resume` table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS resume (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_url text,
  created_at timestamptz DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- New content tables
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  award text NOT NULL,
  award_rank text NOT NULL DEFAULT 'other',
  date text,
  project text,
  team text,
  image text,
  "order" int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  organization text,
  period text,
  active boolean DEFAULT false,
  "order" int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  degree text NOT NULL,
  institution text,
  period text,
  description text,
  status text DEFAULT 'completed',
  "order" int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  icon text,
  skills jsonb NOT NULL DEFAULT '[]',
  "order" int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS hobbies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  icon text,
  "order" int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  value int NOT NULL DEFAULT 0,
  suffix text,
  icon text,
  featured boolean DEFAULT false,
  "order" int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_settings (
  id int PRIMARY KEY DEFAULT 1,
  display_name text,
  hero_headline text,
  hero_subheadline text,
  about_bio text,
  available_status boolean DEFAULT true,
  profile_image text,
  github_url text,
  linkedin_url text,
  email text,
  location text,
  github_username text,
  resume_url text,
  seo_title text,
  seo_description text,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text,
  message text,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Public read allowed on all content; writes happen via service-role
-- (which bypasses RLS) from server actions. Anon role has no write access.
-- ---------------------------------------------------------------------------
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE hobbies ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Drop any pre-existing public-read policies to keep this idempotent
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'projects','resume','achievements','activities','education',
    'skills','hobbies','metrics','site_settings','contact_messages'
  ]
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "public_read_%I" ON %I;', t, t);
  END LOOP;
END $$;

DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'projects','resume','achievements','activities','education',
    'skills','hobbies','metrics','site_settings','contact_messages'
  ]
  LOOP
    EXECUTE format(
      'CREATE POLICY "public_read_%I" ON %I FOR SELECT USING (true);',
      t, t
    );
  END LOOP;
END $$;

-- contact_messages: only service-role can insert/update (admin writes).
-- Public insert is intentionally NOT granted.

-- ---------------------------------------------------------------------------
-- Storage buckets
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

DROP POLICY IF EXISTS "public_read_media" ON storage.objects;
CREATE POLICY "public_read_media" ON storage.objects
  FOR SELECT USING (bucket_id IN ('portfolio-media', 'resumes'));

-- Writes (insert/update/delete) are performed with the service-role key,
-- which bypasses storage RLS, so no anon insert policy is needed.
