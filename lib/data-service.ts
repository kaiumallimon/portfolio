import { connectToDatabase } from "@/lib/db/mongodb";
import { Project, Experience, Skill, SiteSettings, Message, IProject, IExperience, ISkill, ISiteSettings } from "@/lib/models";

// Fallback site settings if MongoDB is not yet seeded
export const fallbackSiteSettings: ISiteSettings = {
  name: "Kaium Al Limon",
  title: "Full-Stack & Design Engineer",
  headline: "Crafting minimal interfaces, cross-platform apps, and resilient distributed services.",
  bio: "Computer Science student at United International University (UIU), Dhaka. Focused on the intersection of design engineering, Flutter mobile apps, Next.js architecture, and systems programming.",
  email: "kaiumallimon@gmail.com",
  location: "Dhaka, Bangladesh",
  timezone: "Asia/Dhaka",
  availableForHire: true,
  statusText: "Available for engineering roles & select contracts",
  githubUrl: "https://github.com/kaiumallimon",
  linkedinUrl: "https://linkedin.com/in/kaiumallimon",
  twitterUrl: "https://x.com/kaiumallimon",
  resumeUrl: "/resume.pdf",
} as unknown as ISiteSettings;

// Fallback curated projects
export const fallbackProjects: Partial<IProject>[] = [
  {
    title: "GitHub Unwrapped",
    slug: "github-unwrapped",
    summary: "Personalized Spotify-Wrapped-style retrospective for developer contributions, streaks, language shifts, and gamification ranks.",
    description: "An interactive, visually rich analytics experience parsing GitHub GraphQL activity to generate downloadable stats cards and community rank metrics.",
    tags: ["Next.js 16", "TypeScript", "Tailwind CSS", "GitHub GraphQL", "html-to-image"],
    demoUrl: "/tools/github-unwrapped",
    githubUrl: "https://github.com/kaiumallimon/github-unwrapped",
    stars: 34,
    forks: 8,
    featured: true,
    order: 1,
    category: "Tools",
  },
  {
    title: "UIU Exam Routine Finder",
    slug: "uiu-exam-routine-finder",
    summary: "High-speed schedule search engine and timetable organizer serving 4,000+ university students during finals.",
    description: "Instant regex-filtered schedule extraction tool with multi-course conflict detection, live room tracking, and mobile-friendly export.",
    tags: ["React 19", "FastAPI", "TypeScript", "Tailwind CSS"],
    demoUrl: "/tools/uiu-exam-routine",
    githubUrl: "https://github.com/kaiumallimon/exam-routine",
    stars: 52,
    forks: 14,
    featured: true,
    order: 2,
    category: "Tools",
  },
  {
    title: "UIU CGPA Calculator",
    slug: "uiu-cgpa-calculator",
    summary: "Predictive academic grading tool featuring semester goal mapping and cumulative GPA projections.",
    description: "Comprehensive academic calculation suite calibrated to university grading policies with real-time target course modeling.",
    tags: ["Next.js", "Zustand", "Tailwind CSS", "Radix UI"],
    demoUrl: "/tools/uiu-cgpa-calculator",
    githubUrl: "https://github.com/kaiumallimon/cgpa-calculator",
    stars: 28,
    forks: 5,
    featured: true,
    order: 3,
    category: "Tools",
  },
  {
    title: "Cross-Platform Flutter Health Suite",
    slug: "flutter-health-suite",
    summary: "Real-time health monitoring and tele-consultation client powered by Flutter & WebRTC.",
    description: "End-to-end encrypted medical reporting app featuring interactive charts, offline-first SQLite sync, and doctor video consults.",
    tags: ["Flutter", "Dart", "Firebase", "WebRTC", "Bloc"],
    demoUrl: "https://github.com/kaiumallimon",
    githubUrl: "https://github.com/kaiumallimon",
    stars: 45,
    forks: 12,
    featured: true,
    order: 4,
    category: "Mobile",
  },
  {
    title: "Microservices API Gateway & Event Bus",
    slug: "microservices-gateway",
    summary: "High-throughput asynchronous gateway built with FastAPI, Redis streams, and Docker.",
    description: "Distributed service mesh with JWT authentication, token-bucket rate limiting, and observability telemetry.",
    tags: ["Python", "FastAPI", "Docker", "Redis", "PostgreSQL"],
    demoUrl: "https://github.com/kaiumallimon",
    githubUrl: "https://github.com/kaiumallimon",
    stars: 39,
    forks: 9,
    featured: false,
    order: 5,
    category: "Full-Stack",
  },
];

// Fallback experience & journey
export const fallbackExperiences: Partial<IExperience>[] = [
  {
    role: "Full-Stack Software Engineer",
    company: "Freelance & Independent Research",
    location: "Dhaka, Bangladesh",
    period: "2023 — Present",
    description: "Engineering scalable web and cross-platform applications with modern TypeScript, Flutter, and cloud-native databases.",
    highlights: [
      "Engineered automated academic utilities serving 4,000+ active university users.",
      "Architected clean Next.js server components with sub-second page delivery.",
      "Designed pixel-safe, accessible user interfaces following strict design engineering principles.",
    ],
    current: true,
    order: 1,
  },
  {
    role: "Computer Science & Engineering",
    company: "United International University (UIU)",
    location: "Dhaka, Bangladesh",
    period: "2022 — Present",
    description: "Pursuing B.Sc. in CSE. Focused on algorithms, distributed databases, software architecture, and computer systems.",
    highlights: [
      "Active competitive programmer and hackathon finalist.",
      "Technical lead for university developer communities.",
    ],
    current: true,
    order: 2,
  },
  {
    role: "Mobile App Developer (Flutter)",
    company: "Contract & Client Solutions",
    location: "Remote",
    period: "2022 — 2023",
    description: "Built and deployed cross-platform mobile apps on Android & iOS with BLoC state management and REST/GraphQL APIs.",
    highlights: [
      "Shipped 3 production applications with 99.8% crash-free sessions.",
      "Implemented seamless offline caching and hardware sensor integrations.",
    ],
    current: false,
    order: 3,
  },
];

// Fallback Skills
export const fallbackSkills: { category: string; skills: string[] }[] = [
  {
    category: "Languages",
    skills: ["TypeScript", "JavaScript", "Python", "Dart", "SQL", "C++", "Go"],
  },
  {
    category: "Frontend & UI",
    skills: ["Next.js (App Router)", "React 19", "Tailwind CSS v4", "BoardUI", "Framer Motion", "Radix UI"],
  },
  {
    category: "Mobile",
    skills: ["Flutter", "Dart", "BLoC Pattern", "Android / iOS", "SQLite", "Firebase"],
  },
  {
    category: "Backend & Systems",
    skills: ["Node.js", "Express", "FastAPI", "MongoDB & Mongoose", "Passport.js", "PostgreSQL", "Redis"],
  },
  {
    category: "DevOps & Tools",
    skills: ["Docker", "Git / GitHub Actions", "Vercel", "Linux", "Postman", "Figma"],
  },
];

export async function getSiteSettings(): Promise<ISiteSettings> {
  try {
    const db = await connectToDatabase();
    if (db) {
      const settings = await SiteSettings.findOne().lean();
      if (settings) return settings as unknown as ISiteSettings;
    }
  } catch (err) {
    console.warn("[DataService] MongoDB fetch failed, using fallback:", err);
  }
  return fallbackSiteSettings;
}

export async function getProjects(): Promise<Partial<IProject>[]> {
  try {
    const db = await connectToDatabase();
    if (db) {
      const list = await Project.find().sort({ order: 1 }).lean();
      if (list && list.length > 0) return list as unknown as Partial<IProject>[];
    }
  } catch (err) {
    console.warn("[DataService] Projects MongoDB fetch failed:", err);
  }
  return fallbackProjects;
}

export async function getExperiences(): Promise<Partial<IExperience>[]> {
  try {
    const db = await connectToDatabase();
    if (db) {
      const list = await Experience.find().sort({ order: 1 }).lean();
      if (list && list.length > 0) return list as unknown as Partial<IExperience>[];
    }
  } catch (err) {
    console.warn("[DataService] Experiences MongoDB fetch failed:", err);
  }
  return fallbackExperiences;
}

export async function getSkills() {
  return fallbackSkills;
}
