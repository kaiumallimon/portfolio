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

// All 13 authentic projects matching database schema
export const fallbackProjects: Partial<IProject>[] = [
  {
    title: "MediTouch",
    name: "MediTouch",
    slug: "meditouch",
    summary:
      "MediTouch is a telemedicine platform delivering affordable, accessible healthcare and education to underserved communities in rural Bangladesh.",
    short_details:
      "MediTouch is a telemedicine platform delivering affordable, accessible healthcare and education to underserved communities in rural Bangladesh.",
    description:
      "Champion Award Winner at UIU CSE Project Show. Built with Flutter, Dart, Firebase, and real-time medical appointment orchestration.",
    tags: ["Flutter", "Dart", "Firebase", "WebRTC", "Clean Architecture"],
    technologies: ["Flutter", "Dart", "Firebase", "WebRTC", "Clean Architecture"],
    demoUrl: undefined,
    githubUrl: "https://github.com/kaiumallimon/meditouch",
    github_url: "https://github.com/kaiumallimon/meditouch",
    stars: 0,
    forks: 0,
    featured: true,
    order: 0,
    client: "mobile",
    category: "Mobile",
  },
  {
    title: "COSMOS ITS",
    name: "COSMOS ITS",
    slug: "cosmos-its",
    summary:
      "COSMOS-ITS (Collaborative Orchestration System for Multi-Agent Optimization and Synthesis for Intelligent Tutoring Systems) is a personalized academic support for university students provided by an AI-powered intelligent tutoring System.",
    short_details:
      "COSMOS-ITS (Collaborative Orchestration System for Multi-Agent Optimization and Synthesis for Intelligent Tutoring Systems) is a personalized academic support for university students provided by an AI-powered intelligent tutoring System.",
    description:
      "Personalized academic tutoring for university students powered by an AI-driven multi-agent orchestration architecture.",
    tags: ["Multi-Agent", "LangChain", "Next.js", "Python", "FastAPI"],
    technologies: ["Multi-Agent", "LangChain", "Next.js", "Python", "FastAPI"],
    demoUrl: "https://cosmos-its-amber.vercel.app/",
    live_url: "https://cosmos-its-amber.vercel.app/",
    githubUrl: "https://github.com/kaiumallimon/comos-its",
    github_url: "https://github.com/kaiumallimon/comos-its",
    stars: 0,
    forks: 0,
    featured: true,
    order: 2,
    client: "web",
    category: "Web",
  },
  {
    title: "GadgetWizard",
    name: "GadgetWizard",
    slug: "gadgetwizard",
    summary:
      "A production-grade full-featured tech e-commerce platform for Australia region built with Next.js 16, React 19, TypeScript, Tailwind CSS v4 and MySQL.",
    short_details:
      "A production-grade full-featured tech e-commerce platform for Australia region built with Next.js 16, React 19, TypeScript, Tailwind CSS v4 and MySQL.",
    description:
      "Full-featured Australian retail store with real-time cart, high-concurrency order processing, and dynamic inventory management.",
    tags: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "MySQL"],
    technologies: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "MySQL"],
    demoUrl: "https://gadgetwizard.com.au/",
    live_url: "https://gadgetwizard.com.au/",
    githubUrl: "https://github.com/kaiumallimon/gadgetwizard",
    github_url: "https://github.com/kaiumallimon/gadgetwizard",
    stars: 0,
    forks: 0,
    featured: true,
    order: 2,
    client: "web",
    category: "Web",
  },
  {
    title: "Aven - AI-Powered Job Application Tracker & Career Workspace",
    name: "Aven - AI-Powered Job Application Tracker & Career Workspace",
    slug: "aven-ai-career-workspace",
    summary:
      "An AI-powered career workspace that helps job seekers organize applications, analyze job opportunities, tailor resumes, and prepare for interviews. It combines AI-powered job extraction, resume matching, outreach automation, interview preparation, and career analytics in one platform.",
    short_details:
      "An AI-powered career workspace that helps job seekers organize applications, analyze job opportunities, tailor resumes, and prepare for interviews. It combines AI-powered job extraction, resume matching, outreach automation, interview preparation, and career analytics in one platform.",
    tags: ["Next.js", "AI", "Resume Matching", "Career Analytics"],
    technologies: ["Next.js", "AI", "Resume Matching", "Career Analytics"],
    demoUrl: undefined,
    githubUrl: "https://github.com/kaiumallimon/Aven---AI-Powered-Job-Application-Tracker",
    github_url: "https://github.com/kaiumallimon/Aven---AI-Powered-Job-Application-Tracker",
    stars: 0,
    forks: 0,
    featured: true,
    order: 3,
    client: "web",
    category: "Tools",
  },
  {
    title: "Portfolio Website",
    name: "Portfolio Website",
    slug: "portfolio-website",
    summary:
      "Fully managable modern portfolio website made by Next.js.",
    short_details:
      "Fully managable modern portfolio website made by Next.js.",
    tags: ["Next.js", "Supabase", "reCaptcha", "Framer", "Shadcn"],
    technologies: ["Next.js", "Supabase", "reCaptcha", "Framer", "Shadcn"],
    demoUrl: "https://www.kaiumallimon.tech",
    live_url: "https://www.kaiumallimon.tech",
    githubUrl: "https://github.com/kaiumallimon/portfolio",
    github_url: "https://github.com/kaiumallimon/portfolio",
    stars: 0,
    forks: 0,
    featured: true,
    order: 3,
    client: "web",
    category: "Web",
  },
  {
    title: "Dorm of Decents",
    name: "Dorm of Decents",
    slug: "dorm-of-decents",
    summary:
      "A comprehensive bachelor flat expense management system built with Next.js 16, React 19, Tailwind CSS v4 & Firebase.",
    short_details:
      "A comprehensive bachelor flat expense management system built with Next.js 16, React 19, Tailwind CSS v4 & Firebase.",
    tags: ["Next.js 16", "React 19", "Tailwind CSS v4", "Firebase"],
    technologies: ["Next.js 16", "React 19", "Tailwind CSS v4", "Firebase"],
    demoUrl: "https://dorm-of-decents.vercel.app/",
    live_url: "https://dorm-of-decents.vercel.app/",
    githubUrl: "https://github.com/kaiumallimon/dorm-of-descent",
    github_url: "https://github.com/kaiumallimon/dorm-of-descent",
    stars: 0,
    forks: 0,
    featured: false,
    order: 4,
    client: "web",
    category: "Web",
  },
  {
    title: "Viae",
    name: "Viae",
    slug: "viae",
    summary:
      "A full-featured resume builder that combines a structured section-by-section editor with multiple layout templates, real-time ATS readability scoring, and high-fidelity PDF export — all in one cohesive application.",
    short_details:
      "A full-featured resume builder that combines a structured section-by-section editor with multiple layout templates, real-time ATS readability scoring, and high-fidelity PDF export — all in one cohesive application.",
    tags: ["Next.js", "React", "ATS Scoring", "PDF Export"],
    technologies: ["Next.js", "React", "ATS Scoring", "PDF Export"],
    demoUrl: undefined,
    githubUrl: "https://github.com/kaiumallimon/viae",
    github_url: "https://github.com/kaiumallimon/viae",
    stars: 0,
    forks: 0,
    featured: false,
    order: 5,
    client: "web",
    category: "Web",
  },
  {
    title: "Neuroweb",
    name: "Neuroweb",
    slug: "neuroweb",
    summary:
      "An Australian digital marketing & web development agency portfolio built with Next.js 16 and React 19.",
    short_details:
      "An Australian digital marketing & web development agency portfolio built with Next.js 16 and React 19.",
    tags: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS"],
    technologies: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS"],
    demoUrl: "https://www.neuroweb.com.au/",
    live_url: "https://www.neuroweb.com.au/",
    githubUrl: "https://github.com/kaiumallimon/neuroweb",
    github_url: "https://github.com/kaiumallimon/neuroweb",
    stars: 0,
    forks: 0,
    featured: false,
    order: 5,
    client: "web",
    category: "Web",
  },
  {
    title: "Nex",
    name: "Nex",
    slug: "nex",
    summary:
      "A modern AI chatbot application built with Flutter.",
    short_details:
      "A modern AI chatbot application built with Flutter.",
    tags: ["Flutter", "Dart", "AI Chatbot", "GetX"],
    technologies: ["Flutter", "Dart", "AI Chatbot", "GetX"],
    demoUrl: undefined,
    githubUrl: "https://github.com/kaiumallimon/nex",
    github_url: "https://github.com/kaiumallimon/nex",
    stars: 0,
    forks: 0,
    featured: false,
    order: 6,
    client: "mobile",
    category: "Mobile",
  },
  {
    title: "Quran Companion",
    name: "Quran Companion",
    slug: "quran-companion",
    summary:
      "A production-grade, offline-first Quran companion application.",
    short_details:
      "A production-grade, offline-first Quran companion application.",
    tags: ["Flutter", "Dart", "Offline-First", "Clean Architecture"],
    technologies: ["Flutter", "Dart", "Offline-First", "Clean Architecture"],
    demoUrl: undefined,
    githubUrl: "https://github.com/kaiumallimon/al-quran",
    github_url: "https://github.com/kaiumallimon/al-quran",
    stars: 0,
    forks: 0,
    featured: false,
    order: 6,
    client: "mobile",
    category: "Mobile",
  },
  {
    title: "Melbourne Acid Washing",
    name: "Melbourne Acid Washing",
    slug: "melbourne-acid-washing",
    summary:
      "A high-performance marketing website for a Melbourne-based exterior cleaning business.",
    short_details:
      "A high-performance marketing website for a Melbourne-based exterior cleaning business.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    demoUrl: "https://melbourne-acid-washing.vercel.app/",
    live_url: "https://melbourne-acid-washing.vercel.app/",
    githubUrl: "https://github.com/kaiumallimon/melbourne-acid-washing",
    github_url: "https://github.com/kaiumallimon/melbourne-acid-washing",
    stars: 0,
    forks: 0,
    featured: false,
    order: 7,
    client: "web",
    category: "Web",
  },
  {
    title: "UIU CGPA Calculator",
    name: "UIU CGPA Calculator",
    slug: "uiu-cgpa-calculator",
    summary:
      "A modern, user-friendly CGPA (Cumulative Grade Point Average) calculator built specifically for United International University students.",
    short_details:
      "A modern, user-friendly CGPA (Cumulative Grade Point Average) calculator built specifically for United International University students.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Zustand"],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Zustand"],
    demoUrl: "https://uiu-cgpa-calculator-three.vercel.app/",
    live_url: "https://uiu-cgpa-calculator-three.vercel.app/",
    githubUrl: "https://github.com/kaiumallimon/uiu-cgpa-calculator",
    github_url: "https://github.com/kaiumallimon/uiu-cgpa-calculator",
    stars: 0,
    forks: 0,
    featured: false,
    order: 9,
    client: "web",
    category: "Tools",
  },
  {
    title: "Pharmbrew",
    name: "Pharmbrew",
    slug: "pharmbrew",
    summary:
      "A comprehensive and scalable Integrated Industry Management System built with Flutter for web.",
    short_details:
      "A comprehensive and scalable Integrated Industry Management System built with Flutter for web.",
    tags: ["Flutter Web", "Dart", "PostgreSQL", "Provider"],
    technologies: ["Flutter Web", "Dart", "PostgreSQL", "Provider"],
    demoUrl: undefined,
    githubUrl: "https://github.com/kaiumallimon/pharmbrew",
    github_url: "https://github.com/kaiumallimon/pharmbrew",
    stars: 0,
    forks: 0,
    featured: false,
    order: 11,
    client: "web",
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
    status: "completed",
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
      const list = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
      if (list && list.length > 0) {
        console.log(`[DataService] Fetched ${list.length} projects directly from MongoDB database.`);
        return JSON.parse(JSON.stringify(list)) as Partial<IProject>[];
      }
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
