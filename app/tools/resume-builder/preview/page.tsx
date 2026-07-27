"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Download, Loader2, ArrowLeft, Phone, Mail } from "lucide-react";
import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";
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

type Project = {
  id: string;
  title: string;
  bulletPoints: string[];
  status: string;
  liveUrl: string;
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
  projects: Project[];
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

function normalizeUrl(url: string) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}

function hasData(arr: any[]) {
  return arr.some((item) =>
    Object.values(item).some((v) => typeof v === "string" ? v.trim() !== "" : true)
  );
}

/* ------------------------------------------------------------------ */
/* Section Title                                                      */
/* ------------------------------------------------------------------ */

function SectionTitle({ text }: { text: string }) {
  return (
    <div style={{ marginTop: "1.5em", marginBottom: "0.5em" }}>
      <h2
        className="font-bold tracking-wider text-gray-900"
        style={{
          fontSize: "13.5pt",
          textTransform: "uppercase",
          borderBottom: "0.8px solid rgba(0,0,0,0.15)",
          paddingBottom: "0.1em",
          fontFamily: "inherit",
        }}
      >
        {text}
      </h2>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function ResumePreviewPage() {
  const router = useRouter();
  const [data, setData] = useState<ResumeData | null>(null);
  const [downloadingImg, setDownloadingImg] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raw = localStorage.getItem("resume-builder-data");
    if (!raw) {
      router.replace("/tools/resume-builder");
      return;
    }
    setData(JSON.parse(raw));
  }, [router]);

  const handleDownloadPng = async () => {
    if (!resumeRef.current) return;
    setDownloadingImg(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      const dataUrl = await toPng(resumeRef.current, {
        cacheBust: true,
        backgroundColor: "#ffffff",
        pixelRatio: 3,
        style: { boxShadow: "none" } as Partial<CSSStyleDeclaration>,
      });
      const link = document.createElement("a");
      link.download = `${data?.fullName?.replace(/\s+/g, "_") || "resume"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to download resume image:", err);
    } finally {
      setDownloadingImg(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!data) return;
    setDownloadingPdf(true);
    try {
      const response = await fetch("/api/resume-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(await response.text());
      const blob = await response.blob();
      const fileName = `${data.fullName.replace(/\s+/g, "_") || "resume"}.pdf`;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download resume PDF:", err);
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen w-full bg-slate-950 text-slate-300 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  const hasProjects = hasData(data.projects);
  const hasExperience = hasData(data.experiences);
  const hasSkills = hasData(data.skillGroups);
  const hasEducation = hasData(data.education);
  const hasActivities = hasData(data.activities);
  const hasAchievements = hasData(data.achievements);
  const hasReferences = hasData(data.references);

  const ICON_SIZE = { width: 10, height: 10 };

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
              This is how your resume will look. You can download it as a PDF or image.
            </motion.p>
          </div>

          <div className="flex justify-center gap-4 mb-8 flex-wrap">
            <Button
              variant="outline"
              onClick={() => router.push("/tools/resume-builder")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Edit
            </Button>
            <Button
              onClick={handleDownloadPng}
              disabled={downloadingImg}
              className="gap-2 bg-indigo-500 hover:bg-indigo-600 text-white"
            >
              {downloadingImg ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Download as Image
            </Button>
            <Button
              onClick={handleDownloadPdf}
              disabled={downloadingPdf}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {downloadingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Download as PDF
            </Button>
          </div>

          {/* === RESUME === */}
          <div style={{ position: "relative" }}>
            <div
              id="resume-print-area"
              ref={resumeRef}
              className="bg-white text-gray-900 mx-auto"
              style={{
                width: "215.9mm",
                padding: "16.51mm 16.51mm",
                fontSize: "10pt",
                lineHeight: "1.15",
                fontFamily: "var(--font-crimson-pro), Georgia, serif",
                WebkitFontSmoothing: "antialiased",
                MozOsxFontSmoothing: "grayscale",
                textRendering: "optimizeLegibility",
              }}
          >
            {/* ===== HEADER ===== */}
            <div className="text-center">
              <h1
                className="font-bold tracking-tight text-gray-900"
                style={{ fontSize: "25pt", fontFamily: "inherit" }}
              >
                {data.fullName.toUpperCase()}
              </h1>
              <div style={{ height: "0.3em" }} />
              <p className="text-gray-800" style={{ fontSize: "11pt" }}>
                {data.designation.toUpperCase()}
              </p>
              <div style={{ height: "0.5em" }} />
              <div className="text-gray-600" style={{ fontSize: "8pt" }}>
                {data.phone && (
                  <span>
                    <Phone style={{ display: "inline", ...ICON_SIZE, marginRight: 2, verticalAlign: "middle" }} />
                    {data.phone}
                  </span>
                )}
                {data.email && (
                  <span className="ml-3">
                    <Mail style={{ display: "inline", ...ICON_SIZE, marginRight: 2, verticalAlign: "middle" }} />
                    <a href={`mailto:${data.email}`} className="text-gray-600 no-underline hover:underline">{data.email}</a>
                  </span>
                )}
                {data.github && (
                  <span className="ml-3">
                    <FaGithub style={{ display: "inline", ...ICON_SIZE, marginRight: 2, verticalAlign: "middle" }} />
                    <a href={normalizeUrl(data.github)} target="_blank" rel="noopener noreferrer" className="text-gray-600 no-underline hover:underline">{data.githubShow || data.github}</a>
                  </span>
                )}
                {data.linkedin && (
                  <span className="ml-3">
                    <FaLinkedin style={{ display: "inline", ...ICON_SIZE, marginRight: 2, verticalAlign: "middle" }} />
                    <a href={normalizeUrl(data.linkedin)} target="_blank" rel="noopener noreferrer" className="text-gray-600 no-underline hover:underline">{data.linkedinShow || data.linkedin}</a>
                  </span>
                )}
                {data.portfolio && (
                  <span className="ml-3">
                    <FaGlobe style={{ display: "inline", ...ICON_SIZE, marginRight: 2, verticalAlign: "middle" }} />
                    <a href={normalizeUrl(data.portfolio)} target="_blank" rel="noopener noreferrer" className="text-gray-600 no-underline hover:underline">{data.portfolioShow || data.portfolio}</a>
                  </span>
                )}
              </div>
            </div>

            <div style={{ height: "1.5em" }} />

            {/* ===== PROFILE ===== */}
            {data.overview.trim() && (
              <>
                <p className="text-gray-800" style={{ fontSize: "9.5pt", lineHeight: "1.2" }}>
                  {data.overview}
                </p>
                <div style={{ height: "0.5em" }} />
              </>
            )}

            {/* ===== PROJECTS ===== */}
            {hasProjects && (
              <>
                <SectionTitle text="PROJECTS" />
                {data.projects
                  .filter((p) => p.title.trim())
                  .map((proj, i) => (
                    <div key={i} style={{ marginBottom: "0.5em" }}>
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-gray-900" style={{ fontSize: "10pt" }}>
                          {proj.title}
                        </span>
                        <span className="font-bold text-gray-900" style={{ fontSize: "10pt" }}>
                          {proj.status || ""}
                        </span>
                      </div>
                      {proj.liveUrl && (
                        <p className="text-gray-700" style={{ fontSize: "9pt", fontStyle: "italic" }}>
                          <a href={normalizeUrl(proj.liveUrl)} target="_blank" rel="noopener noreferrer" className="text-gray-700 no-underline hover:underline">
                            {proj.liveUrl}
                          </a>
                        </p>
                      )}
                      {proj.bulletPoints.filter(Boolean).length > 0 && (
                        <ul style={{ margin: "0.3em 0 0 0", paddingLeft: "1.2em", listStyle: "disc outside", fontSize: "9.5pt" }}>
                          {proj.bulletPoints.filter(Boolean).map((bp, j) => (
                            <li key={j} className="text-gray-800" style={{ lineHeight: "1.2" }}>
                              {bp}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
              </>
            )}

            {/* ===== EXPERIENCE ===== */}
            {hasExperience && (
              <>
                <SectionTitle text="EXPERIENCE" />
                {data.experiences
                  .filter((e) => e.designation.trim())
                  .map((exp, i) => (
                    <div key={i} style={{ marginBottom: "0.5em" }}>
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-gray-900" style={{ fontSize: "10pt" }}>
                          {exp.designation}
                        </span>
                        <span className="font-bold text-gray-900" style={{ fontSize: "10pt" }}>
                          {exp.status || ""}
                        </span>
                      </div>
                      {exp.company && (
                        <p className="text-gray-700" style={{ fontSize: "9pt", fontStyle: "italic" }}>
                          {exp.company}
                          {exp.startDate || exp.endDate
                            ? ` — ${[formatDate(exp.startDate), formatDate(exp.endDate)].filter(Boolean).join(" – ")}`
                            : ""}
                        </p>
                      )}
                      {exp.bulletPoints.filter(Boolean).length > 0 && (
                        <ul style={{ margin: "0.3em 0 0 0", paddingLeft: "1.2em", listStyle: "disc outside", fontSize: "9.5pt" }}>
                          {exp.bulletPoints.filter(Boolean).map((bp, j) => (
                            <li key={j} className="text-gray-800" style={{ lineHeight: "1.2" }}>
                              {bp}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
              </>
            )}

            {/* ===== TECHNICAL SKILLS ===== */}
            {hasSkills && (
              <>
                <SectionTitle text="TECHNICAL SKILLS" />
                <div style={{ fontSize: "9.5pt", lineHeight: "1.4" }}>
                  {data.skillGroups
                    .filter((s) => s.title.trim())
                    .map((sg, i) => (
                      <p key={i} className="text-gray-800" style={{ margin: "0 0 0.1em 0" }}>
                        <span className="font-bold text-gray-900">{sg.title}:</span>{" "}
                        {sg.skills}
                      </p>
                    ))}
                </div>
              </>
            )}

            {/* ===== EDUCATION ===== */}
            {hasEducation && (
              <>
                <SectionTitle text="EDUCATION" />
                {data.education
                  .filter((e) => e.course.trim())
                  .map((edu, i) => (
                    <div key={i} style={{ marginBottom: "0.5em" }}>
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-gray-900" style={{ fontSize: "10pt" }}>
                          {edu.course}
                        </span>
                        <span className="font-bold text-gray-900" style={{ fontSize: "10pt" }}>
                          {[formatDate(edu.startDate), formatDate(edu.endDate)].filter(Boolean).join(" – ")}
                        </span>
                      </div>
                      <p className="text-gray-700" style={{ fontSize: "9pt", fontStyle: "italic" }}>
                        {edu.institution}
                      </p>
                      {edu.result && (
                        <p className="text-gray-700" style={{ fontSize: "9pt", fontStyle: "italic" }}>
                          {edu.result}
                        </p>
                      )}
                    </div>
                  ))}
              </>
            )}

            {/* ===== EXTRACURRICULAR ACTIVITIES ===== */}
            {hasActivities && (
              <>
                <SectionTitle text="EXTRACURRICULAR ACTIVITIES" />
                {data.activities
                  .filter((a) => a.title.trim())
                  .map((act, i) => (
                    <div key={i} style={{ marginBottom: "0.3em" }}>
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-gray-900" style={{ fontSize: "10pt" }}>
                          {act.title}
                        </span>
                        {act.duration && (
                          <span className="text-gray-600" style={{ fontSize: "9pt" }}>
                            {act.duration}
                          </span>
                        )}
                      </div>
                      {act.organization && (
                        <p className="text-gray-700" style={{ fontSize: "9pt", fontStyle: "italic" }}>
                          {act.organization}
                        </p>
                      )}
                      {act.description && (
                        <p className="text-gray-700" style={{ fontSize: "9pt" }}>
                          {act.description}
                        </p>
                      )}
                    </div>
                  ))}
              </>
            )}

            {/* ===== ACHIEVEMENTS ===== */}
            {hasAchievements && (
              <>
                <SectionTitle text="ACHIEVEMENTS" />
                <ul style={{ margin: "0.3em 0 0 0", paddingLeft: "1.2em", listStyle: "disc outside", fontSize: "9.5pt" }}>
                  {data.achievements
                    .filter((a) => a.result.trim() || a.description.trim())
                    .map((ach, i) => (
                      <li key={i} className="text-gray-800" style={{ lineHeight: "1.2", marginBottom: "0.3em" }}>
                        <span className="font-bold text-gray-900">{ach.result}</span>
                        {ach.description ? ` – ${ach.description}` : ""}
                      </li>
                    ))}
                </ul>
              </>
            )}

            {/* ===== REFERENCES ===== */}
            {hasReferences && (
              <>
                <SectionTitle text="REFERENCES" />
                {data.references
                  .filter((r) => r.name.trim())
                  .map((ref, i) => (
                    <div key={i} style={{ marginBottom: "0.5em" }}>
                      <p className="font-bold text-gray-900" style={{ fontSize: "10pt" }}>
                        {ref.name}
                      </p>
                      <p className="text-gray-700" style={{ fontSize: "9pt", fontStyle: "italic" }}>
                        {[ref.designation, ref.company].filter(Boolean).join(", ")}
                      </p>
                      <p className="text-gray-600" style={{ fontSize: "9pt" }}>
                        {[ref.phone, ref.email].filter(Boolean).join(" | ")}
                      </p>
                    </div>
                  ))}
              </>
            )}
          </div>
          <div
            style={{
              position: "absolute",
              top: "16.51mm",
              left: "16.51mm",
              width: "calc(215.9mm - 33.02mm)",
              height: "calc(100% - 33.02mm)",
              pointerEvents: "none",
              backgroundRepeat: "repeat-y",
              backgroundImage:
                "repeating-linear-gradient(to bottom, transparent 0, transparent 246.35mm, rgba(0,0,0,0.08) 246.35mm, rgba(0,0,0,0.08) 246.38mm)",
            }}
          />
        </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
