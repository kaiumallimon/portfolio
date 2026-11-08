import { connectToDatabase } from "@/lib/db/mongodb";
import {
  Project,
  Experience,
  SiteSettings,
  IProject,
  IExperience,
  ISiteSettings,
} from "@/lib/models";

export interface IEducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  description: string;
  status: "current" | "completed";
}

export interface IAchievementItem {
  id: string;
  title: string;
  award: string;
  awardRank: "champion" | "1st-runner-up" | "2nd-runner-up";
  date: string;
  project: string;
  team: string;
}

// Fallback site settings populated with authentic live data from kaiumallimon.tech
export const fallbackSiteSettings: ISiteSettings = {
  name: "Kaium Al Limon",
  title: "Full-Stack Software Engineer",
  headline:
    "Building high-performance mobile & web experiences engineered to scale.",
  bio: "Computer Science & Engineering student at United International University (UIU), Dhaka. Focused on fluid Flutter mobile applications, modern Next.js web platforms, and resilient backends built with FastAPI and Node.js + Express. Former Head of Software & Innovation at UIU App Forum and 4-time UIU CSE Project Show award winner.",
  email: "kalimon291@gmail.com",
  phone: "+880 1888 387 500",
  location: "Dhaka, Bangladesh",
  timezone: "Asia/Dhaka",
  availableForHire: true,
  statusText: "Available for engineering roles & select contracts",
  githubUrl: "https://github.com/kaiumallimon",
  linkedinUrl: "https://linkedin.com/in/kaiumallimon",
  twitterUrl: "https://x.com/kaiumallimon",
  facebookUrl: "https://facebook.com/kaiumallimon",
  resumeUrl:
    "https://nomrxaytlgdddhwjkkqo.supabase.co/storage/v1/object/public/resumes/1786734778380-87o1hmihtey.pdf",
} as unknown as ISiteSettings;

// All 13 authentic projects from kaiumallimon.tech
export const fallbackProjects: Partial<IProject>[] = [
  {
    title: "MediTouch",
    slug: "meditouch",
    summary:
      "Telemedicine mobile platform delivering affordable, accessible healthcare and health education to underserved communities in rural Bangladesh.",
    description:
      "Champion Award Winner at UIU CSE Project Show. Built with Flutter, Dart, Firebase, and real-time medical appointment orchestration.",
    tags: ["Flutter", "Dart", "Firebase", "WebRTC", "Clean Architecture"],
    demoUrl: "https://github.com/kaiumallimon/meditouch",
    githubUrl: "https://github.com/kaiumallimon/meditouch",
    stars: 48,
    forks: 12,
    featured: true,
    order: 1,
    category: "Mobile",
  },
  {
    title: "GadgetWizard",
    slug: "gadgetwizard",
    summary:
      "Production-grade tech e-commerce platform for the Australia region built with Next.js 16, React 19, TypeScript, Tailwind CSS v4 and MySQL.",
    description:
      "Full-featured Australian retail store with real-time cart, high-concurrency order processing, and dynamic inventory management.",
    tags: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "MySQL"],
    demoUrl: "https://gadgetwizard.com.au/",
    githubUrl: "https://github.com/kaiumallimon/gadgetwizard",
    stars: 32,
    forks: 7,
    featured: true,
    order: 2,
    category: "Web",
  },
  {
    title: "COSMOS ITS",
    slug: "cosmos-its",
    summary:
      "Collaborative Orchestration System for Multi-Agent Optimization and Synthesis for Intelligent Tutoring Systems.",
    description:
      "Personalized academic tutoring for university students powered by an AI-driven multi-agent orchestration architecture.",
    tags: ["Next.js", "React", "TypeScript", "LangChain", "FastAPI"],
    demoUrl: "https://cosmos-its-amber.vercel.app/",
    githubUrl: "https://github.com/kaiumallimon/comos-its",
    stars: 29,
    forks: 6,
    featured: true,
    order: 3,
    category: "Web",
  },
  {
    title: "Aven — AI Career Workspace",
    slug: "aven-ai-career-workspace",
    summary:
      "AI-powered career workspace that helps job seekers organize applications, analyze opportunities, tailor resumes, and prepare for interviews.",
    description:
      "Combines AI-powered job extraction, resume matching, automated outreach pipelines, and career progression analytics.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "OpenAI", "Supabase"],
    demoUrl:
      "https://github.com/kaiumallimon/Aven---AI-Powered-Job-Application-Tracker",
    githubUrl:
      "https://github.com/kaiumallimon/Aven---AI-Powered-Job-Application-Tracker",
    stars: 24,
    forks: 4,
    featured: true,
    order: 4,
    category: "Tools",
  },
  {
    title: "Portfolio Website",
    slug: "portfolio-website",
    summary:
      "Fully manageable, pixel-safe design engineering portfolio with CAD isometric drawings and high-fidelity telemetry.",
    description:
      "Crafted with Next.js, TypeScript, Tailwind CSS v4, Framer Motion, and Supabase / MongoDB data layers.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS v4", "Framer Motion", "MongoDB"],
    demoUrl: "https://www.kaiumallimon.tech",
    githubUrl: "https://github.com/kaiumallimon/portfolio",
    stars: 22,
    forks: 5,
    featured: true,
    order: 5,
    category: "Web",
  },
  {
    title: "Dorm of Decents",
    slug: "dorm-of-decents",
    summary:
      "Comprehensive bachelor flat expense and meal management system built with Next.js 16, React 19, Tailwind CSS v4 & Firebase.",
    description:
      "Real-time expense splitting, utility tracking, daily grocery audits, and automated monthly balance calculations.",
    tags: ["Next.js 16", "React 19", "Firebase", "Tailwind CSS v4"],
    demoUrl: "https://dorm-of-decents.vercel.app/",
    githubUrl: "https://github.com/kaiumallimon/dorm-of-descent",
    stars: 18,
    forks: 3,
    featured: true,
    order: 6,
    category: "Web",
  },
  {
    title: "Viae — ATS Resume Builder",
    slug: "viae-ats-resume-builder",
    summary:
      "Structured section-by-section resume editor with multiple templates, real-time ATS readability scoring, and PDF export.",
    description:
      "High-fidelity client-side PDF renderer with automated keyword density analysis and recruiter-standard formatting.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "pdfmake"],
    demoUrl: "https://github.com/kaiumallimon/viae",
    githubUrl: "https://github.com/kaiumallimon/viae",
    stars: 26,
    forks: 6,
    featured: true,
    order: 7,
    category: "Tools",
  },
  {
    title: "Neuroweb Digital Agency",
    slug: "neuroweb-digital-agency",
    summary:
      "Australian digital marketing & web development agency platform built with Next.js 16, React 19, and modern animations.",
    description:
      "Commercial agency showcase delivering sub-second load times, interactive service catalog, and conversion funnels.",
    tags: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS"],
    demoUrl: "https://www.neuroweb.com.au/",
    githubUrl: "https://github.com/kaiumallimon/neuroweb",
    stars: 15,
    forks: 2,
    featured: true,
    order: 8,
    category: "Web",
  },
  {
    title: "Quran Companion",
    slug: "quran-companion",
    summary:
      "Production-grade, offline-first Quran companion application featuring fluid typography and translation bookmarking.",
    description:
      "Built with Flutter and SQLite for zero-latency local caching, audio recitation playback, and prayer calculation schedules.",
    tags: ["Flutter", "Dart", "SQLite", "Audio Player", "BLoC"],
    demoUrl: "https://github.com/kaiumallimon/al-quran",
    githubUrl: "https://github.com/kaiumallimon/al-quran",
    stars: 31,
    forks: 9,
    featured: true,
    order: 9,
    category: "Mobile",
  },
  {
    title: "Nex AI Chatbot",
    slug: "nex-ai-chatbot",
    summary:
      "Modern AI assistant client app built with Flutter, featuring streaming token responses and local conversation history.",
    description:
      "Cross-platform client connecting to LLM endpoints with syntax highlighting, markdown rendering, and local memory.",
    tags: ["Flutter", "Dart", "LLM Streaming", "GetX"],
    demoUrl: "https://github.com/kaiumallimon/nex",
    githubUrl: "https://github.com/kaiumallimon/nex",
    stars: 19,
    forks: 4,
    featured: true,
    order: 10,
    category: "Mobile",
  },
  {
    title: "Melbourne Acid Washing",
    slug: "melbourne-acid-washing",
    summary:
      "High-performance commercial marketing website for a Melbourne-based exterior cleaning and restoration business.",
    description:
      "SEO-optimized service platform featuring instant booking quotation calculator and lead capture automation.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    demoUrl: "https://melbourne-acid-washing.vercel.app/",
    githubUrl: "https://github.com/kaiumallimon/melbourne-acid-washing",
    stars: 12,
    forks: 1,
    featured: true,
    order: 11,
    category: "Web",
  },
  {
    title: "UIU CGPA Calculator",
    slug: "uiu-cgpa-calculator",
    summary:
      "Predictive academic grading tool built specifically for United International University students.",
    description:
      "Accurate GPA forecast algorithms aligned with UIU credit policies, semester target mapping, and score persistence.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Zustand"],
    demoUrl: "https://uiu-cgpa-calculator-three.vercel.app/",
    githubUrl: "https://github.com/kaiumallimon/uiu-cgpa-calculator",
    stars: 37,
    forks: 11,
    featured: true,
    order: 12,
    category: "Tools",
  },
  {
    title: "Pharmbrew",
    slug: "pharmbrew",
    summary:
      "Integrated Industry Management System for pharmaceutical supply chain operations built with Flutter Web.",
    description:
      "1st Runner-Up Award Winner at UIU CSE Project Show. Features batch tracking, raw material auditing, and relational database backend.",
    tags: ["Flutter Web", "Dart", "PostgreSQL", "Provider"],
    demoUrl: "https://github.com/kaiumallimon/pharmbrew",
    githubUrl: "https://github.com/kaiumallimon/pharmbrew",
    stars: 27,
    forks: 5,
    featured: true,
    order: 13,
    category: "Web",
  },
];

// Authentic UIU App Forum leadership journey
export const fallbackExperiences: Partial<IExperience>[] = [
  {
    role: "Head of Software & Innovation",
    company: "UIU App Forum",
    location: "Dhaka, Bangladesh",
    period: "Sep 2024 — Oct 2025",
    description:
      "Leading software development and student innovation initiatives at United International University's premier software engineering club.",
    highlights: [
      "Directed university-wide software workshops, mentoring 120+ students in Flutter and full-stack development.",
      "Spearheaded internal tooling projects and open-source campus initiatives.",
      "Coordinated project show grooming camps that produced multiple podium-winning teams.",
    ],
    current: false,
    order: 1,
  },
  {
    role: "Junior Executive of Development",
    company: "UIU App Forum",
    location: "Dhaka, Bangladesh",
    period: "Aug 2023 — Sep 2024",
    description:
      "Organized technical bootcamps, code reviews, and cross-platform app sprints for forum members.",
    highlights: [
      "Mentored junior developers in Git workflows, state management, and Clean Architecture.",
      "Engineered automated club utilities and event registration portals.",
    ],
    current: false,
    order: 2,
  },
  {
    role: "Mentor — Grooming for CSE Project Show",
    company: "UIU App Forum",
    location: "Dhaka, Bangladesh",
    period: "Aug 2023",
    description:
      "Conducted specialized training bootcamps preparing undergraduate teams for the competitive UIU CSE Project Show.",
    highlights: [
      "Guided teams on architectural decisions, database normalization, and live pitch presentation.",
    ],
    current: false,
    order: 3,
  },
  {
    role: "General Member",
    company: "UIU App Forum",
    location: "Dhaka, Bangladesh",
    period: "Mar 2022 — Aug 2023",
    description:
      "Participated actively in hackathons, algorithm study circles, and collaborative mobile app sprints.",
    highlights: [
      "Contributed to student community repositories and mobile UI experiments.",
    ],
    current: false,
    order: 4,
  },
];

// Authentic Education history
export const fallbackEducation: IEducationItem[] = [
  {
    id: "uiu-bsc",
    degree: "B.Sc. in Computer Science & Engineering",
    institution: "United International University",
    period: "2022 — 2026",
    description:
      "Specializing in full-stack mobile & web development, system architecture, and cloud technologies.",
    status: "current",
  },
  {
    id: "safiuddin-hsc",
    degree: "Higher Secondary Certificate (HSC)",
    institution: "Safiuddin Sarkar Academy & College",
    period: "2018 — 2020",
    description: "GPA: 5.00 — Science Group",
    status: "completed",
  },
  {
    id: "daudpur-ssc",
    degree: "Secondary School Certificate (SSC)",
    institution: "Daudpur Putina High School",
    period: "2013 — 2018",
    description: "GPA: 5.00 — Science Group",
    status: "completed",
  },
];

// Authentic Competition Achievements / Honors
export const fallbackAchievements: IAchievementItem[] = [
  {
    id: "sad-summer-24",
    title: "UIU CSE Project Show | Summer '24",
    award: "Champion – System Analysis and Design",
    awardRank: "champion",
    date: "8 September 2024",
    project: "MediTouch",
    team: "Team Bcrypt",
  },
  {
    id: "se-fall-24",
    title: "UIU CSE Project Show | Fall '24",
    award: "1st Runner-Up – Software Engineering Lab",
    awardRank: "1st-runner-up",
    date: "27 January 2025",
    project: "MediTouch",
    team: "Team Bcrypt",
  },
  {
    id: "dbms-spring-24",
    title: "UIU CSE Project Show | Spring '24",
    award: "1st Runner-Up – Database Management System (DBMS)",
    awardRank: "1st-runner-up",
    date: "3 June 2024",
    project: "Pharmabrew",
    team: "Team Bcrypt",
  },
  {
    id: "aoop-spring-23",
    title: "UIU CSE Project Show | Spring '23",
    award: "2nd Runner-Up – Advanced Object-Oriented Programming (AOOP)",
    awardRank: "2nd-runner-up",
    date: "3 May 2023",
    project: "Wayout",
    team: "Team Tripod",
  },
];

// Authentic Skills Arsenal grouped into the 4 live categories
export const fallbackSkills: { category: string; skills: string[] }[] = [
  {
    category: "01 Mobile & Core",
    skills: [
      "Flutter",
      "Dart",
      "BLoC",
      "Provider",
      "GetX",
      "Clean Architecture",
      "Responsive Designs",
      "Custom Widgets",
      "State Management",
      "Navigation & Routing",
      "Firebase Integration",
      "REST APIs",
      "CI/CD for Flutter",
    ],
  },
  {
    category: "02 AI & Intelligent Systems",
    skills: [
      "LangChain",
      "LangGraph",
      "RAG Systems",
      "ChromaDB",
      "Pinecone",
      "Multi-Agent Orchestration",
    ],
  },
  {
    category: "03 Backend & API",
    skills: [
      "FastAPI",
      "Python",
      "Node.js",
      "Express",
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Firebase",
      "Supabase",
    ],
  },
  {
    category: "04 Web & DevOps",
    skills: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS v4",
      "Git",
      "GitHub Actions",
      "Docker",
      "CI/CD",
      "Vercel",
      "Netlify",
    ],
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

export async function getEducation(): Promise<IEducationItem[]> {
  return fallbackEducation;
}

export async function getAchievements(): Promise<IAchievementItem[]> {
  return fallbackAchievements;
}

export async function getSkills() {
  return fallbackSkills;
}
