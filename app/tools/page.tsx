'use client';

import { Calendar } from "lucide-react";
import { FaCalculator, FaTimesCircle } from "react-icons/fa";
import { SiGithub } from "react-icons/si";
import FloatingHeader from "@/components/shared/header";
import HomeBackground from "@/components/shared/home-color-bend";
import TargetCursor from "@/components/TargetCursor";
import Footer from "@/components/custom-new/footer";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function ToolsPage() {
  const tools = [
    {
      name: "Github Unwrapped",
      description: "A web app that visualizes your GitHub stats, contributions, and repositories in an engaging way.",
      link: "/tools/github-unwrapped",
      icon: <SiGithub className="w-12 h-12" />,
      status: {
        isAvailable: true,
        label: "Available",
      },
    },

    {
      name: "UIU Exam Routine Finder",
      description:
        "A tool to help United International University students quickly find and download their exam routines.",
      link: "/tools/uiu-exam-routine",
      icon: <Calendar className="w-12 h-12" />,
      status: {
        isAvailable: true,
        label: "Available",
      },
    },

    {
      name: "UIU CGPA Calculator",
      description:
        "A simple CGPA calculator for United International University students to compute their semester and cumulative GPA.",
      link: null,
      icon: <FaCalculator className="w-12 h-12" />,
      status: {
        isAvailable: false,
        label: "Coming Soon",
      },
    },
  ];

  return (
    <div className="bg-slate-950 text-slate-300 antialiased selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-x-hidden">
      <TargetCursor
        spinDuration={2}
        hideDefaultCursor
        parallaxOn
        hoverDuration={0.2}
      />

      <HomeBackground />
      <FloatingHeader />

      <div className="relative">
        <div className="max-w-7xl mx-auto py-42 px-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-slate-400 hover:text-white">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">Tools</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl md:text-4xl font-extrabold text-center mb-4 tracking-tight text-white">
          Tools & Utilities
        </h1>
        <p className="text-center text-white/70 mb-10 max-w-2xl mx-auto">
          A collection of web-based tools that I have developed for making our digital lives easier and more efficient.
        </p>

        {/* Tools List */}
        <div className="flex flex-col gap-[18px] w-full">
          {tools.map((tool, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl p-4 min-h-[220px] bg-transparent border border-white/12 hover:-translate-y-1.5 transition-transform duration-200"
            >
              <a
                href={tool.link ?? "#"}
                className={`block h-full ${!tool.status.isAvailable ? "pointer-events-none" : ""}`}
              >
                <div className={`flex flex-col md:flex-row gap-10 h-full ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                  {/* Icon Visual */}
                  <div className="relative flex-[0_0_48%] min-h-[350px] md:min-h-[220px] rounded-xl overflow-hidden bg-[#841fff] flex items-center justify-center">
                    <div className="text-white/80">{tool.icon}</div>
                  </div>

                  {/* Content */}
                  <div className={`relative z-4 flex flex-col gap-2.5 flex-1 ${index % 2 === 1 ? "md:items-start" : "md:items-end"}`}>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium ${
                          tool.status.isAvailable
                            ? "bg-green-600/20 text-green-100 border border-green-500/30"
                            : "bg-yellow-600/20 text-yellow-100 border border-yellow-500/30"
                        }`}
                      >
                        {tool.status.label}
                      </span>
                    </div>

                    <h2 className="font-bold text-[1.08rem] tracking-[-0.2px] text-[#f7f7f7]">{tool.name}</h2>

                    <p className="text-[rgba(235,235,235,0.88)] text-[0.9rem]">{tool.description}</p>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
