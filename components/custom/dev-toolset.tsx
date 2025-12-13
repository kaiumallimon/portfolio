"use client";

import React from "react";
import {
  SiFlutter,
  SiDart,
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiCss3,
  SiHtml5,
  SiJavascript,
  SiPython,
  SiNodedotjs,
  SiExpress,
  SiSupabase,
  SiFirebase,
  SiPostgresql,
  SiSqlite,
  SiMongodb,
  SiGithub,
  SiGitlab,
  SiDocker,
  SiAndroidstudio,
  SiApple,
  SiGithubactions,
  SiJest,
  SiEslint,
  SiPrettier,
  SiFigma,
  SiAdobeillustrator,
  SiPostman,
  SiGraphql,
  SiFastapi,
  SiLangchain,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import LogoLoop from "../LogoLoop";

const tools = [
  { name: "Flutter", icon: SiFlutter },
  { name: "Dart", icon: SiDart },
  { name: "Next.js", icon: SiNextdotjs },
  { name: "React", icon: SiReact },
  { name: "TypeScript", icon: SiTypescript },
  { name: "Tailwind CSS", icon: SiTailwindcss },
  { name: "CSS3", icon: SiCss3 },
  { name: "HTML5", icon: SiHtml5 },
  { name: "JavaScript", icon: SiJavascript },
  { name: "Python", icon: SiPython },
  { name: "FastAPI", icon: SiFastapi },
  { name: "Langchain", icon: SiLangchain },
  { name: "Node.js", icon: SiNodedotjs },
  { name: "Express.js", icon: SiExpress },
  { name: "Supabase", icon: SiSupabase },
  { name: "Firebase", icon: SiFirebase },
  { name: "PostgreSQL", icon: SiPostgresql },
  { name: "SQLite", icon: SiSqlite },
  { name: "MongoDB", icon: SiMongodb },
  { name: "GitHub", icon: SiGithub },
  { name: "GitLab", icon: SiGitlab },
  { name: "VS Code", icon: VscVscode },
  { name: "Android Studio", icon: SiAndroidstudio },
  { name: "GitHub Actions", icon: SiGithubactions },
  { name: "ESLint", icon: SiEslint },
  { name: "Prettier", icon: SiPrettier },
  { name: "Figma", icon: SiFigma },
  { name: "Postman", icon: SiPostman },
];

export default function ToolsetGrid() {
  const logoItems = tools.map((tool) => ({
    node: <tool.icon size={48} />,
    title: tool.name,
  }));

  return (
    <div className="w-full py-10 ">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-center text-white">
        My Development Toolset
      </h2>

      {/* Horizontal looping carousel */}
      {/* <div style={{ height: 80, position: "relative", overflow: "hidden" }}>
        <LogoLoop
          logos={logoItems}
          speed={120}
          direction="left"
          logoHeight={48}
          gap={40}
          hoverSpeed={0}
          scaleOnHover
          ariaLabel="Technology tools carousel"
        />
      </div> */}

      {/* Static grid below */}
      <div className="max-w-7xl mx-auto px-4 mt-15 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-10 justify-items-center items-center">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.name}
              className="flex flex-col items-center space-y-2 text-white hover:scale-110 transition-transform duration-300"
              title={tool.name}
            >
              <Icon className="text-foreground" size={40} />
              <span className="text-xs text-center text-muted-foreground">{tool.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
