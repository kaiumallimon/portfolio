export interface TechItem {
  name: string;
  isPrimary?: boolean;
  note?: string; // Optional tooltip note (e.g. "used in: <project>")
}

export interface StackCategory {
  id: "mobile" | "backend" | "ai" | "web-devops";
  stageNumber: string;
  title: string;
  subtitle: string;
  description: string;
  filterKey: "Mobile" | "Backend" | "AI" | "Web & DevOps";
  items: TechItem[];
}

export const STACK_FILTER_KEYS = [
  "All",
  "Mobile",
  "Backend",
  "AI",
  "Web & DevOps",
] as const;

export type StackFilterKey = (typeof STACK_FILTER_KEYS)[number];

// Pipeline flow: Mobile & Core -> Backend & API -> AI & Intelligent Systems -> Web & DevOps
export const STACK_PIPELINE: StackCategory[] = [
  {
    id: "mobile",
    stageNumber: "01",
    title: "Mobile & Core",
    subtitle: "Client Interfaces & Logic",
    description: "High-performance cross-platform applications engineered with Clean Architecture.",
    filterKey: "Mobile",
    items: [
      { name: "Flutter", isPrimary: true, note: "used in: Meditouch & Pharmbrew" },
      { name: "Dart", note: "Primary mobile & client language" },
      { name: "BLoC", note: "Enterprise reactive state management" },
      { name: "Provider" },
      { name: "GetX", note: "used in: Nex AI Chatbot" },
      { name: "Clean Architecture", note: "Domain/Data/Presentation separation" },
      { name: "Responsive Designs" },
      { name: "Custom Widgets" },
      { name: "State Management" },
      { name: "Navigation & Routing" },
      { name: "Firebase Integration", note: "Auth, Firestore & Push notifications" },
      { name: "REST APIs", note: "Contract-first endpoint integration" },
      { name: "CI/CD for Flutter", note: "Automated test & APK builds" },
    ],
  },
  {
    id: "backend",
    stageNumber: "03",
    title: "Backend & API",
    subtitle: "Distributed Services & Storage",
    description: "Resilient asynchronous services, relational schemas, and fast document stores.",
    filterKey: "Backend",
    items: [
      { name: "FastAPI", isPrimary: true, note: "used in: COSMOS ITS & Python APIs" },
      { name: "Python", note: "Core backend & data scripting" },
      { name: "Node.js", note: "Event-driven microservices" },
      { name: "Express" },
      { name: "PostgreSQL", isPrimary: true, note: "used in: Pharmbrew & relational schemas" },
      { name: "MySQL", note: "used in: GadgetWizard e-commerce" },
      { name: "MongoDB", note: "used in: Portfolio database layer" },
      { name: "Firebase" },
      { name: "Supabase", note: "used in: Aven (AI Workspace)" },
    ],
  },
  {
    id: "ai",
    stageNumber: "02",
    title: "AI & Intelligent Systems",
    subtitle: "Agentic RAG & Vector Intelligence",
    description: "Multi-agent workflows, vector retrieval, and context-augmented synthesis.",
    filterKey: "AI",
    items: [
      { name: "LangChain", isPrimary: true, note: "used in: COSMOS ITS Multi-Agent system" },
      { name: "LangGraph", note: "Stateful cyclical multi-agent graph flows" },
      { name: "RAG Systems", note: "Context retrieval with dense embeddings" },
      { name: "ChromaDB", note: "Local semantic vector stores" },
      { name: "Pinecone", note: "Production cloud vector indexing" },
      { name: "Multi-Agent Orchestration", note: "Coordinated LLM tool execution" },
    ],
  },
  {
    id: "web-devops",
    stageNumber: "04",
    title: "Web & DevOps",
    subtitle: "Production Web & Automated Delivery",
    description: "Type-safe web platforms with containerized delivery and continuous integration.",
    filterKey: "Web & DevOps",
    items: [
      { name: "Next.js 16", isPrimary: true, note: "used in: GadgetWizard & Portfolio" },
      { name: "React 19", note: "Modern concurrent client features" },
      { name: "TypeScript", isPrimary: true, note: "Strict type-safety across all codebases" },
      { name: "Tailwind CSS v4", note: "Zero-runtime architectural tokens" },
      { name: "Git", note: "Version control & trunk workflows" },
      { name: "GitHub Actions", note: "Automated test, lint & build workflows" },
      { name: "Docker", note: "Reproducible container environments" },
      { name: "CI/CD" },
      { name: "Vercel", note: "Edge hosting & preview deployments" },
      { name: "Netlify" },
    ],
  },
];
