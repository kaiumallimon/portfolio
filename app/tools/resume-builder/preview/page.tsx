"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Download, Loader2, ArrowLeft } from "lucide-react";
import { toPng } from "html-to-image";
import FloatingHeader from "@/components/shared/header";
import HomeBackground from "@/components/shared/home-color-bend";
import TargetCursor from "@/components/TargetCursor";
import Footer from "@/components/custom-new/footer";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

type Experience = {
  id: string;
  designation: string;
  company: string;
  bulletPoints: string[];
  status: string;
  startDate: string;
  endDate: string;
};

type SkillGroup = {
  id: string;
  title: string;
  skills: string;
};

type Education = {
  id: string;
  course: string;
  institution: string;
  startDate: string;
  endDate: string;
  result: string;
};

type Activity = {
  id: string;
  title: string;
  organization: string;
  duration: string;
  description: string;
};

type Achievement = {
  id: string;
  result: string;
  description: string;
};

type Reference = {
  id: string;
  name: string;
  designation: string;
  company: string;
  phone: string;
  email: string;
};

type ResumeData = {
  fullName: string;
  designation: string;
  phone: string;
  email: string;
  github: string;
  githubShow: string;
  linkedin: string;
  linkedinShow: string;
  portfolio: string;
  portfolioShow: string;
  overview: string;
  experiences: Experience[];
  skillGroups: SkillGroup[];
  education: Education[];
  activities: Activity[];
  achievements: Achievement[];
  references: Reference[];
};

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDate(ym: string) {
  if (!ym) return "";
  const [y, m] = ym.split("-");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[parseInt(m, 10) - 1] || m} ${y}`;
}

function contactParts(d: ResumeData) {
  const parts: string[] = [];
  if (d.phone) parts.push(d.phone);
  if (d.email) parts.push(d.email);
  if (d.github) parts.push(d.githubShow || d.github);
  if (d.linkedin) parts.push(d.linkedinShow || d.linkedin);
  if (d.portfolio) parts.push(d.portfolioShow || d.portfolio);
  return parts;
}

function hasData(arr: any[]) {
  return arr.some((item) =>
    Object.values(item).some((v) => typeof v === "string" ? v.trim() !== "" : true)
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function ResumePreviewPage() {
  const router = useRouter();
  const [data, setData] = useState<ResumeData | null>(null);
  const [downloading, setDownloading] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raw = localStorage.getItem("resume-builder-data");
    if (!raw) {
      router.replace("/tools/resume-builder");
      return;
    }
    setData(JSON.parse(raw));
  }, [router]);

  const handleDownload = async () => {
    if (!resumeRef.current) return;
    setDownloading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      const dataUrl = await toPng(resumeRef.current, {
        cacheBust: true,
        backgroundColor: "#ffffff",
        pixelRatio: 2,
        skipFonts: true,
      });
      const link = document.createElement("a");
      link.download = `${data?.fullName?.replace(/\s+/g, "_") || "resume"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to download resume:", err);
    } finally {
      setDownloading(false);
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen w-full bg-slate-950 text-slate-300 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  const contacts = contactParts(data);
  const hasExperience = hasData(data.experiences);
  const hasSkills = hasData(data.skillGroups);
  const hasEducation = hasData(data.education);
  const hasActivities = hasData(data.activities);
  const hasAchievements = hasData(data.achievements);
  const hasReferences = hasData(data.references);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-300">
      <TargetCursor spinDuration={2} hideDefaultCursor parallaxOn hoverDuration={0.2} />
      <HomeBackground />
      <FloatingHeader />
      <div className="max-w-4xl mx-auto py-38 px-6 relative">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-slate-400 hover:text-white">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/tools" className="text-slate-400 hover:text-white">Tools</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/tools/resume-builder" className="text-slate-400 hover:text-white">Resume Builder</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">Preview</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-10">
            <motion.h1
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-2xl md:text-4xl font-extrabold tracking-tight bg-linear-to-r from-white to-white/70 bg-clip-text text-transparent"
            >
              Resume Preview
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white/70 text-sm md:text-base mt-2"
            >
              This is how your resume will look. You can download it as an image.
            </motion.p>
          </div>

          {/* Toolbar */}
          <div className="flex justify-center gap-4 mb-8">
            <Button
              variant="outline"
              onClick={() => router.push("/tools/resume-builder")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Edit
            </Button>
            <Button
              onClick={handleDownload}
              disabled={downloading}
              className="gap-2 bg-indigo-500 hover:bg-indigo-600 text-white"
            >
              {downloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Download as Image
            </Button>
          </div>

          {/* Resume */}
          <div
            ref={resumeRef}
            className="bg-white text-gray-900 rounded-none shadow-2xl mx-auto"
            style={{ width: "210mm", padding: "20mm 25mm" }}
          >
            {/* Name */}
            <h1
              className="text-3xl font-bold tracking-tight text-gray-900"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              {data.fullName}
            </h1>
            <p className="text-base text-gray-600 mt-0.5">{data.designation}</p>

            {/* Contact */}
            {contacts.length > 0 && (
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                {contacts.join("  |  ")}
              </p>
            )}

            {/* Divider */}
            <hr className="my-3 border-gray-300" />

            {/* Overview */}
            {data.overview.trim() && (
              <>
                <h2 className="text-sm font-bold tracking-wider uppercase text-gray-800 mb-1">
                  Professional Summary
                </h2>
                <p className="text-xs text-gray-700 leading-relaxed mb-4">
                  {data.overview}
                </p>
              </>
            )}

            {/* Experience */}
            {hasExperience && (
              <>
                <h2 className="text-sm font-bold tracking-wider uppercase text-gray-800 mb-2">
                  Experience
                </h2>
                {data.experiences
                  .filter((e) => e.designation.trim())
                  .map((exp, i) => (
                    <div key={i} className="mb-3">
                      <div className="flex justify-between items-baseline">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {exp.designation}
                          </p>
                          <p className="text-xs text-gray-600">
                            {[exp.company, exp.status].filter(Boolean).join(" — ")}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 shrink-0 ml-4">
                          {[formatDate(exp.startDate), formatDate(exp.endDate)]
                            .filter(Boolean)
                            .join(" – ")}
                        </p>
                      </div>
                      {exp.bulletPoints.filter(Boolean).length > 0 && (
                        <ul className="mt-1 space-y-0.5">
                          {exp.bulletPoints
                            .filter(Boolean)
                            .map((bp, j) => (
                              <li
                                key={j}
                                className="text-xs text-gray-700 pl-4 relative"
                              >
                                <span className="absolute left-0 top-[0.35em] w-1 h-1 rounded-full bg-gray-400" />
                                {bp}
                              </li>
                            ))}
                        </ul>
                      )}
                    </div>
                  ))}
              </>
            )}

            {/* Skills */}
            {hasSkills && (
              <>
                <h2 className="text-sm font-bold tracking-wider uppercase text-gray-800 mb-2 mt-4">
                  Technical Skills
                </h2>
                <div className="space-y-1">
                  {data.skillGroups
                    .filter((s) => s.title.trim())
                    .map((sg, i) => (
                      <p key={i} className="text-xs text-gray-700">
                        <span className="font-semibold text-gray-900">
                          {sg.title}:
                        </span>{" "}
                        {sg.skills}
                      </p>
                    ))}
                </div>
              </>
            )}

            {/* Education */}
            {hasEducation && (
              <>
                <h2 className="text-sm font-bold tracking-wider uppercase text-gray-800 mb-2 mt-4">
                  Education
                </h2>
                {data.education
                  .filter((e) => e.course.trim())
                  .map((edu, i) => (
                    <div key={i} className="flex justify-between items-baseline mb-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {edu.course}
                        </p>
                        <p className="text-xs text-gray-600">
                          {edu.institution}
                          {edu.result ? ` — ${edu.result}` : ""}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 shrink-0 ml-4">
                        {[formatDate(edu.startDate), formatDate(edu.endDate)]
                          .filter(Boolean)
                          .join(" – ")}
                      </p>
                    </div>
                  ))}
              </>
            )}

            {/* Extracurricular */}
            {hasActivities && (
              <>
                <h2 className="text-sm font-bold tracking-wider uppercase text-gray-800 mb-2 mt-4">
                  Extracurricular Activities
                </h2>
                {data.activities
                  .filter((a) => a.title.trim())
                  .map((act, i) => (
                    <div key={i} className="mb-2">
                      <div className="flex justify-between items-baseline">
                        <p className="text-sm font-semibold text-gray-900">
                          {act.title}
                        </p>
                        {act.duration && (
                          <p className="text-xs text-gray-500 shrink-0 ml-4">
                            {act.duration}
                          </p>
                        )}
                      </div>
                      {act.organization && (
                        <p className="text-xs text-gray-600">{act.organization}</p>
                      )}
                      {act.description && (
                        <p className="text-xs text-gray-700 mt-0.5">{act.description}</p>
                      )}
                    </div>
                  ))}
              </>
            )}

            {/* Achievements */}
            {hasAchievements && (
              <>
                <h2 className="text-sm font-bold tracking-wider uppercase text-gray-800 mb-2 mt-4">
                  Achievements
                </h2>
                {data.achievements
                  .filter((a) => a.result.trim() || a.description.trim())
                  .map((ach, i) => (
                    <div key={i} className="mb-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {ach.result}
                      </p>
                      {ach.description && (
                        <p className="text-xs text-gray-700">{ach.description}</p>
                      )}
                    </div>
                  ))}
              </>
            )}

            {/* References */}
            {hasReferences && (
              <>
                <h2 className="text-sm font-bold tracking-wider uppercase text-gray-800 mb-2 mt-4">
                  References
                </h2>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {data.references
                    .filter((r) => r.name.trim())
                    .map((ref, i) => (
                      <div key={i}>
                        <p className="text-sm font-semibold text-gray-900">
                          {ref.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {[ref.designation, ref.company].filter(Boolean).join(", ")}
                        </p>
                        <p className="text-xs text-gray-500">
                          {[ref.phone, ref.email].filter(Boolean).join(" | ")}
                        </p>
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
