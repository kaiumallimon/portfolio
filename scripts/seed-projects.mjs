import mongoose from "mongoose";

const rawProjects = [
  {
    id: "013c9dbc-ceff-41e4-91e3-ef560ed0fdab",
    name: "Dorm of Decents",
    short_details: "A comprehensive bachelor flat expense management system built with Next.js 16, React 19, Tailwind CSS v4 & Firebase.",
    github_url: "https://github.com/kaiumallimon/dorm-of-descent",
    live_url: "https://dorm-of-decents.vercel.app/",
    client: "web",
    order: 4,
    created_at: "2026-07-15 21:59:43.329337+00",
    tags: ["Next.js 16", "React 19", "Tailwind CSS v4", "Firebase"],
    category: "Web",
    slug: "dorm-of-decents",
  },
  {
    id: "0655bef2-d065-442d-972e-6610984e8a95",
    name: "Quran Companion",
    short_details: "A production-grade, offline-first Quran companion application.",
    github_url: "https://github.com/kaiumallimon/al-quran",
    live_url: null,
    client: "mobile",
    order: 6,
    created_at: "2026-07-15 22:02:51.534094+00",
    tags: ["Flutter", "Dart", "Offline-First", "Clean Architecture"],
    category: "Mobile",
    slug: "quran-companion",
  },
  {
    id: "105be92f-a6ff-40ce-827d-0320f2038a27",
    name: "Aven - AI-Powered Job Application Tracker & Career Workspace",
    short_details: "An AI-powered career workspace that helps job seekers organize applications, analyze job opportunities, tailor resumes, and prepare for interviews. It combines AI-powered job extraction, resume matching, outreach automation, interview preparation, and career analytics in one platform.",
    github_url: "https://github.com/kaiumallimon/Aven---AI-Powered-Job-Application-Tracker",
    live_url: null,
    client: null,
    order: 3,
    created_at: "2026-09-07 17:47:29.791965+00",
    tags: ["Next.js", "AI", "Resume Matching", "Career Analytics"],
    category: "Tools",
    slug: "aven-ai-career-workspace",
  },
  {
    id: "219862a5-9a05-4297-b35d-c0a0b0f36e24",
    name: "UIU CGPA Calculator",
    short_details: "A modern, user-friendly CGPA (Cumulative Grade Point Average) calculator built specifically for United International University students.",
    github_url: "https://github.com/kaiumallimon/uiu-cgpa-calculator",
    live_url: "https://uiu-cgpa-calculator-three.vercel.app/",
    client: "web",
    order: 9,
    created_at: "2026-07-15 22:38:37.258039+00",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Zustand"],
    category: "Tools",
    slug: "uiu-cgpa-calculator",
  },
  {
    id: "3bfe4515-b7ed-45bd-afab-b9db81eb8b0c",
    name: "Nex",
    short_details: "A modern AI chatbot application built with Flutter.",
    github_url: "https://github.com/kaiumallimon/nex",
    live_url: null,
    client: "mobile",
    order: 6,
    created_at: "2026-07-15 22:40:03.338692+00",
    tags: ["Flutter", "Dart", "AI Chatbot", "GetX"],
    category: "Mobile",
    slug: "nex",
  },
  {
    id: "42ae651c-a1d6-4578-a103-3f0118df2b0b",
    name: "Neuroweb",
    short_details: "An Australian digital marketing & web development agency portfolio built with Next.js 16 and React 19.",
    github_url: "https://github.com/kaiumallimon/neuroweb",
    live_url: "https://www.neuroweb.com.au/",
    client: "web",
    order: 5,
    created_at: "2026-07-15 21:21:13.540295+00",
    tags: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS"],
    category: "Web",
    slug: "neuroweb",
  },
  {
    id: "4ad65f68-6174-4762-bf8d-8d3fc87add0a",
    name: "COSMOS ITS",
    short_details: "COSMOS-ITS (Collaborative Orchestration System for Multi-Agent Optimization and Synthesis for Intelligent Tutoring Systems) is a personalized academic support for university students provided by an AI-powered intelligent tutoring System.",
    github_url: "https://github.com/kaiumallimon/comos-its",
    live_url: "https://cosmos-its-amber.vercel.app/",
    client: "web",
    order: 2,
    created_at: "2026-07-15 22:06:21.015282+00",
    tags: ["Multi-Agent", "LangChain", "Next.js", "Python", "FastAPI"],
    category: "Web",
    slug: "cosmos-its",
  },
  {
    id: "93429e35-89bc-453c-bc60-a2977eb6ae9e",
    name: "Portfolio Website",
    short_details: "Fully managable modern portfolio website made by Next.js.",
    github_url: "https://github.com/kaiumallimon/portfolio",
    live_url: "https://www.kaiumallimon.tech",
    client: "web",
    order: 3,
    created_at: "2026-07-15 14:52:50.53516+00",
    tags: ["Next.js", "Supabase", "reCaptcha", "Framer", "Shadcn"],
    category: "Web",
    slug: "portfolio-website",
  },
  {
    "id": "97441023-38ea-472a-8041-007ec7ebf744",
    name: "Viae",
    short_details: "A full-featured resume builder that combines a structured section-by-section editor with multiple layout templates, real-time ATS readability scoring, and high-fidelity PDF export — all in one cohesive application.",
    github_url: "https://github.com/kaiumallimon/viae",
    live_url: null,
    client: "web",
    order: 5,
    created_at: "2026-07-29 01:09:39.22211+00",
    tags: ["Next.js", "React", "ATS Scoring", "PDF Export"],
    category: "Web",
    slug: "viae",
  },
  {
    id: "e27f7099-9725-4b3d-a78c-2b89c5e6946b",
    name: "MediTouch",
    short_details: "MediTouch is a telemedicine platform delivering affordable, accessible healthcare and education to underserved communities in rural Bangladesh.",
    github_url: "https://github.com/kaiumallimon/meditouch",
    live_url: null,
    client: "mobile",
    order: 0,
    created_at: "2026-07-15 01:14:07.872755+00",
    tags: ["Flutter", "Dart", "Firebase", "WebRTC", "Clean Architecture"],
    category: "Mobile",
    slug: "meditouch",
  },
  {
    id: "f43d9bbc-a35f-4228-a3ac-eb3d1a351b59",
    name: "Pharmbrew",
    short_details: "A comprehensive and scalable Integrated Industry Management System built with Flutter for web.",
    github_url: "https://github.com/kaiumallimon/pharmbrew",
    live_url: null,
    client: "web",
    order: 11,
    created_at: "2026-07-15 22:41:39.710291+00",
    tags: ["Flutter Web", "Dart", "PostgreSQL", "Provider"],
    category: "Web",
    slug: "pharmbrew",
  },
  {
    id: "fe94c8d9-f4a5-4eda-9002-4d1c80cdf845",
    name: "Melbourne Acid Washing",
    short_details: "A high-performance marketing website for a Melbourne-based exterior cleaning business.",
    github_url: "https://github.com/kaiumallimon/melbourne-acid-washing",
    live_url: "https://melbourne-acid-washing.vercel.app/",
    client: "web",
    order: 7,
    created_at: "2026-07-15 21:39:38.720437+00",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    category: "Web",
    slug: "melbourne-acid-washing",
  },
  {
    id: "ff5f108b-7e59-4b49-8560-67781f26995c",
    name: "GadgetWizard",
    short_details: "A production-grade full-featured tech e-commerce platform for Australia region built with Next.js 16, React 19, TypeScript, Tailwind CSS v4 and MySQL.",
    github_url: "https://github.com/kaiumallimon/gadgetwizard",
    live_url: "https://gadgetwizard.com.au/",
    client: "web",
    order: 2,
    created_at: "2026-07-15 21:50:43.957774+00",
    tags: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "MySQL"],
    category: "Web",
    slug: "gadgetwizard",
  },
];

async function seed() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is required");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB successfully.");

  const collection = mongoose.connection.db.collection("projects");

  // Clear any existing projects
  await collection.deleteMany({});
  console.log("Cleared existing projects in MongoDB collection.");

  const documents = rawProjects.map((p) => {
    // Explicitly NO image or coverImage property included
    return {
      title: p.name,
      name: p.name,
      slug: p.slug,
      summary: p.short_details,
      short_details: p.short_details,
      description: p.short_details,
      tags: p.tags,
      technologies: p.tags,
      demoUrl: p.live_url || undefined,
      live_url: p.live_url || undefined,
      githubUrl: p.github_url || undefined,
      github_url: p.github_url || undefined,
      stars: 0,
      forks: 0,
      featured: p.order <= 3,
      order: p.order,
      client: p.client || (p.category === "Mobile" ? "mobile" : "web"),
      category: p.category,
      createdAt: new Date(p.created_at),
      updatedAt: new Date(),
    };
  });

  const result = await collection.insertMany(documents);
  console.log(`Successfully inserted ${result.insertedCount} projects into MongoDB!`);

  const inserted = await collection.find({}).sort({ order: 1, createdAt: -1 }).toArray();
  console.log("\nVerified projects in MongoDB collection:");
  inserted.forEach((proj, idx) => {
    console.log(`${idx + 1}. [${proj.category}] (order: ${proj.order}) ${proj.title}`);
  });

  await mongoose.disconnect();
  console.log("\nDisconnected cleanly from MongoDB.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
