export interface TechItem {
  name: string;
  isPrimary?: boolean;
  note?: string; // Optional tooltip note (e.g. "used in: <project>")
}

export interface StackCategory {
  id: string;
  title: string;
  items: TechItem[];
}

export const STACK_CATEGORIES: StackCategory[] = [
  {
    id: "mobile-core",
    title: "01 Mobile & Core",
    items: [
      { name: "Flutter", isPrimary: true, note: "used in: Meditouch & Pharmbrew" },
      { name: "Dart", note: "Primary mobile development language" },
      { name: "BLoC", note: "Enterprise reactive state management" },
      { name: "Provider" },
      { name: "GetX", note: "used in: Nex AI Chatbot" },
      { name: "Clean Architecture", note: "Domain / Data / Presentation separation" },
      { name: "Responsive Designs" },
      { name: "Custom Widgets" },
      { name: "State Management" },
      { name: "Navigation & Routing" },
      { name: "Firebase Integration", note: "Auth, Firestore & Push notifications" },
      { name: "REST APIs", note: "Contract-first endpoint integration" },
      { name: "CI/CD for Flutter", note: "Automated test & build pipelines" },
    ],
  },
  {
    id: "ai-systems",
    title: "02 AI & Intelligent Systems",
    items: [
      { name: "LangChain", isPrimary: true, note: "used in: COSMOS ITS Multi-Agent system" },
      { name: "LangGraph", note: "Stateful cyclical multi-agent graph flows" },
      { name: "RAG Systems", note: "Context retrieval with dense vector embeddings" },
      { name: "ChromaDB", note: "Local semantic vector stores" },
      { name: "Pinecone", note: "Production cloud vector indexing" },
      { name: "Multi-Agent Orchestration", note: "Coordinated LLM tool execution" },
    ],
  },
  {
    id: "backend-api",
    title: "03 Backend & API",
    items: [
      { name: "FastAPI", isPrimary: true, note: "used in: COSMOS ITS & Python APIs" },
      { name: "Python", note: "Core backend & data scripting" },
      { name: "Node.js", note: "Event-driven services" },
      { name: "Express" },
      { name: "PostgreSQL", isPrimary: true, note: "used in: Pharmbrew & relational schemas" },
      { name: "MySQL", note: "used in: GadgetWizard e-commerce" },
      { name: "MongoDB", note: "used in: Portfolio database layer" },
      { name: "Firebase" },
      { name: "Supabase", note: "used in: Aven (AI Workspace)" },
    ],
  },
  {
    id: "web-devops",
    title: "04 Web & DevOps",
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
