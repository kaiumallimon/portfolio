-- ============================================================================
-- 0002_2026-07-15T00-00-30_seed.sql
-- Seed current portfolio content (idempotent — skips if rows exist)
-- ============================================================================

-- ---------------------------------------------------------------------------
-- achievements
-- ---------------------------------------------------------------------------
INSERT INTO achievements (title, award, award_rank, date, project, team, image, "order")
SELECT * FROM (VALUES
  ('UIU CSE Project Show | Fall ''24', '1st Runner-Up – Software Engineering Lab', '1st-runner-up', '27 January 2025', 'MediTouch', 'Team Bcrypt', '/software-lab.jpg', 1),
  ('UIU CSE Project Show | Summer ''24', 'Champion – System Analysis and Design', 'champion', '8 September 2024', 'MediTouch', 'Team Bcrypt', '/sad-lab.png', 2),
  ('UIU CSE Project Show | Spring ''24', '1st Runner-Up – Database Management System (DBMS)', '1st-runner-up', '3 June 2024', 'Pharmabrew', 'Team Bcrypt', '/dbms-lab.png', 3),
  ('UIU CSE Project Show | Spring ''23', '2nd Runner-Up – Advanced Object-Oriented Programming (AOOP)', '2nd-runner-up', '3 May 2023', 'Wayout', 'Team Tripod', '/aoop-lab.jpg', 4)
) AS v(title, award, award_rank, date, project, team, image, "order")
WHERE NOT EXISTS (SELECT 1 FROM achievements);

-- ---------------------------------------------------------------------------
-- activities (co-curricular / journey)
-- ---------------------------------------------------------------------------
INSERT INTO activities (title, organization, period, active, "order")
SELECT * FROM (VALUES
  ('Head of Software & Innovation', 'UIU App Forum', 'Sep 2024 – Oct 2025', true, 1),
  ('Junior Executive of Development', 'UIU App Forum', 'Aug 2023 – Sep 2024', false, 2),
  ('Mentor — Grooming for CSE Project Show', 'UIU App Forum', 'Aug 2023', false, 3),
  ('General Member', 'UIU App Forum', 'Mar 2022 – Aug 2023', false, 4)
) AS v(title, organization, period, active, "order")
WHERE NOT EXISTS (SELECT 1 FROM activities);

-- ---------------------------------------------------------------------------
-- education
-- ---------------------------------------------------------------------------
INSERT INTO education (degree, institution, period, description, status, "order")
SELECT * FROM (VALUES
  ('B.Sc. in Computer Science & Engineering', 'United International University', '2022 — Present', 'Specializing in full-stack development, system design, and cloud technologies.', 'current', 1),
  ('Higher Secondary Certificate (HSC)', 'Safiuddin Sarkar Academy & College', '2018 — 2020', 'GPA: 5.00 — (Science Group)', 'completed', 2),
  ('Secondary School Certificate (SSC)', 'Daudpur Putina High School', '2013 — 2018', 'GPA: 5.00 — (Science Group)', 'completed', 3)
) AS v(degree, institution, period, description, status, "order")
WHERE NOT EXISTS (SELECT 1 FROM education);

-- ---------------------------------------------------------------------------
-- skills
-- ---------------------------------------------------------------------------
INSERT INTO skills (category, icon, skills, "order")
SELECT * FROM (VALUES
  ('Mobile & Core', 'FaMobile', '[{"name":"Flutter","highlight":true},{"name":"Dart","highlight":true},{"name":"Provider","highlight":true},{"name":"BLoC","highlight":true},{"name":"GetX","highlight":false},{"name":"Clean Architecture","highlight":false},{"name":"Responsive Designs","highlight":false},{"name":"Custom Widgets","highlight":false},{"name":"State Management","highlight":false},{"name":"Navigation & Routing","highlight":false},{"name":"Firebase Integration","highlight":false},{"name":"REST APIs","highlight":false},{"name":"CI/CD for Flutter","highlight":false}]'::jsonb, 1),
  ('Backend & API', 'Server', '[{"name":"FastAPI","highlight":true},{"name":"Python","highlight":true},{"name":"Node.js","highlight":false},{"name":"Express","highlight":false},{"name":"PostgreSQL","highlight":false},{"name":"MySQL","highlight":false},{"name":"MongoDB","highlight":false},{"name":"Firebase","highlight":false},{"name":"Supabase","highlight":false}]'::jsonb, 2),
  ('Web & DevOps', 'Globe', '[{"name":"Next.js","highlight":true},{"name":"React","highlight":false},{"name":"TypeScript","highlight":false},{"name":"Tailwind CSS","highlight":true},{"name":"Git","highlight":true},{"name":"GitHub Actions","highlight":false},{"name":"Docker","highlight":false},{"name":"CI/CD","highlight":false},{"name":"Vercel","highlight":false},{"name":"Netlify","highlight":false}]'::jsonb, 3)
) AS v(category, icon, skills, "order")
WHERE NOT EXISTS (SELECT 1 FROM skills);

-- ---------------------------------------------------------------------------
-- hobbies
-- ---------------------------------------------------------------------------
INSERT INTO hobbies (title, description, icon, "order")
SELECT * FROM (VALUES
  ('European Football', 'Watching European football leagues and matches regularly to follow the latest games and strategies.', 'MdSportsSoccer', 1),
  ('Gaming', 'Playing games like FIFA, eFootball, PUBG Mobile, and more for fun and improving focus and strategy.', 'MdVideogameAsset', 2),
  ('Movies & Series', 'Watching movies and series to relax and explore storytelling, cinematography, and creativity.', 'MdMovie', 3)
) AS v(title, description, icon, "order")
WHERE NOT EXISTS (SELECT 1 FROM hobbies);

-- ---------------------------------------------------------------------------
-- metrics (impact) — GitHub Stars is fetched live, not seeded
-- ---------------------------------------------------------------------------
INSERT INTO metrics (label, value, suffix, icon, featured, "order")
SELECT * FROM (VALUES
  ('Years in Software Development', 3, '+', 'Smartphone', true, 1),
  ('Competitions', 4, NULL, 'Trophy', false, 2),
  ('Wins & Top 3s', 4, NULL, 'Crown', false, 3),
  ('App Forum Tenure', 3, '+ yrs', 'Users', false, 4)
) AS v(label, value, suffix, icon, featured, "order")
WHERE NOT EXISTS (SELECT 1 FROM metrics);

-- ---------------------------------------------------------------------------
-- site_settings (singleton)
-- ---------------------------------------------------------------------------
INSERT INTO site_settings (
  id, display_name, hero_headline, hero_subheadline, about_bio,
  available_status, profile_image, github_url, linkedin_url, email,
  location, github_username, resume_url, seo_title, seo_description
)
SELECT
  1,
  'Kaium Al Limon',
  'Crafting seamless, user-focused experiences across platforms',
  'Flutter Specialist & Full-Stack Engineer crafting high-performance mobile apps and scalable backends with Flutter, FastAPI, Node.js + Express, and Next.js.',
  'I am currently a B.Sc. Computer Science & Engineering student at United International University (2022–Present). While my academic journey provides the theoretical foundation, my real education happens in the IDE.

Over the past 3 years, I’ve grown into a capable Software Engineer with a deep focus on Flutter. From building scalable backends with FastAPI and Node.js + Express to creating interactive web experiences with Next.js and optimizing mobile UIs, I am passionate about quality and seamless user experiences. I value writing clean, understandable code and learning from real-world constraints through projects.

My goal is to continue building robust and scalable software by learning from real projects, improving with each iteration, and solving practical problems across mobile and web.',
  true,
  '/bordered.png',
  'https://github.com/kaiumallimon',
  'https://linkedin.com/in/kaiumallimon',
  'kalimon291@gmail.com',
  'Dhaka, Bangladesh',
  'kaiumallimon',
  NULL,
  'Kaium Al Limon | Full-Stack Developer',
  'Personal portfolio of Kaium Al Limon, a Full-Stack Cross-Platform Mobile & Web Developer specializing in Flutter & Next.js. Computer Science student at UIU.'
WHERE NOT EXISTS (SELECT 1 FROM site_settings);
