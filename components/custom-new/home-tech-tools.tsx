import { Globe, Server } from "lucide-react";
import { FaMobile } from "react-icons/fa";

const techStack = [
    {
        title: "Mobile & Core",
        icon: FaMobile,
        hoverBorder: "hover:border-blue-500/30",
        iconContainer: "bg-blue-500/10 text-blue-400",
        highlightStyles: "bg-blue-500/10 text-blue-300 border-blue-500/20",
        skills: [
            { name: "Flutter", highlight: true },
            { name: "Dart", highlight: true },
            { name: "Provider", highlight: true },
            { name: "BLoC", highlight: true },
            { name: "GetX", highlight: false },
            { name: "Clean Architecture", highlight: false },
            { name: "Responsive Designs", highlight: false },
            { name: "Custom Widgets", highlight: false },
            { name: "State Management", highlight: false },
            { name: "Navigation & Routing", highlight: false },
            { name: "Firebase Integration", highlight: false },
            { name: "REST APIs", highlight: false },
            { name: "CI/CD for Flutter", highlight: false },
        ]
    },
    {
        title: "Backend & API",
        icon: Server,
        hoverBorder: "hover:border-emerald-500/30",
        iconContainer: "bg-emerald-500/10 text-emerald-400",
        highlightStyles: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
        skills: [
            { name: "FastAPI", highlight: true },
            { name: "Python", highlight: true },
            { name: "Node.js", highlight: false },
            { name: "Express", highlight: false },
            { name: "PostgreSQL", highlight: false },
            { name: "MySQL", highlight: false },
            { name: "MongoDB", highlight: false },
            { name: "Firebase", highlight: false },
            { name: "Supabase", highlight: false },
        ]
    },
    {
        title: "Web & DevOps",
        icon: Globe,
        hoverBorder: "hover:border-indigo-500/30",
        iconContainer: "bg-indigo-500/10 text-indigo-400",
        highlightStyles: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
        skills: [
            { name: "Next.js", highlight: false },
            { name: "React", highlight: false },
            { name: "TypeScript", highlight: false },
            { name: "Tailwind CSS", highlight: false },
            { name: "Git", highlight: false },
            { name: "GitHub Actions", highlight: false },
            { name: "Docker", highlight: false },
            { name: "CI/CD", highlight: false },
            { name: "Vercel", highlight: false },
            { name: "Netlify", highlight: false },
        ]
    }
];

export default function TechToolsSection() {
    return (
        <div >
            <section id="skills" className="py-20 px-6 max-w-6xl mx-auto relative z-10">
                <div className="mb-12">
                    <h2 className="text-3xl font-semibold tracking-tight text-white mb-4">Engineering Toolkit</h2>
                    <p className="text-slate-400 max-w-xl">A full-stack approach with a mobile-first mindset. My stack is chosen for speed, scalability, and developer experience.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {techStack.map((tech, index) => {
                        const Icon = tech.icon;
                        return (
                            <div key={index} className={`glass p-6 rounded-2xl transition-colors ${tech.hoverBorder}`}>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className={`p-2 rounded-lg ${tech.iconContainer}`}>
                                        <Icon size={16} />
                                    </span>
                                    <h3 className="font-medium text-white">{tech.title}</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {tech.skills.map((skill, skillIndex) => (
                                        <span
                                            key={skillIndex}
                                            className={`px-3 py-1 text-xs font-medium rounded-md border ${skill.highlight
                                                    ? `${tech.highlightStyles} border`
                                                    : "bg-white/5 text-slate-300 border-white/10"
                                                }`}
                                        >
                                            {skill.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    )
}