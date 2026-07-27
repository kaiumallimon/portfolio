"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Trash2, ArrowRight, RotateCcw, Download } from "lucide-react";
import { v4 as uuid } from "uuid";
import FloatingHeader from "@/components/shared/header";
import HomeBackground from "@/components/shared/home-color-bend";
import TargetCursor from "@/components/TargetCursor";
import Footer from "@/components/custom-new/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  tools: string;
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
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const emptyExperience = (): Experience => ({
  id: uuid(),
  designation: "",
  company: "",
  bulletPoints: [""],
  status: "",
  startDate: "",
  endDate: "",
});

const emptySkillGroup = (): SkillGroup => ({
  id: uuid(),
  title: "",
  skills: "",
});

const emptyEducation = (): Education => ({
  id: uuid(),
  course: "",
  institution: "",
  startDate: "",
  endDate: "",
  result: "",
});

const emptyActivity = (): Activity => ({
  id: uuid(),
  title: "",
  organization: "",
  duration: "",
  description: "",
});

const emptyProject = (): Project => ({
  id: uuid(),
  title: "",
  bulletPoints: [""],
  status: "",
  liveUrl: "",
  tools: "",
});

const emptyAchievement = (): Achievement => ({
  id: uuid(),
  result: "",
  description: "",
});

const emptyReference = (): Reference => ({
  id: uuid(),
  name: "",
  designation: "",
  company: "",
  phone: "",
  email: "",
});

const STORAGE_KEY = "resume-builder-data";

const defaultData = (): ResumeData => ({
  fullName: "",
  designation: "",
  phone: "",
  email: "",
  github: "",
  githubShow: "",
  linkedin: "",
  linkedinShow: "",
  portfolio: "",
  portfolioShow: "",
  overview: "",
  projects: [{ ...emptyProject() }],
  experiences: [{ ...emptyExperience() }],
  skillGroups: [{ ...emptySkillGroup() }],
  education: [{ ...emptyEducation() }],
  activities: [{ ...emptyActivity() }],
  achievements: [{ ...emptyAchievement() }],
  references: [{ ...emptyReference() }],
});

function migrateItem<T extends Record<string, any>>(saved: any, defaults: T): T {
  return { ...defaults, ...saved } as T;
}

function loadSaved(): ResumeData {
  if (typeof window === "undefined") return defaultData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const merged = { ...defaultData(), ...parsed };
      merged.projects = merged.projects.map((p: any) => migrateItem(p, emptyProject()));
      merged.experiences = merged.experiences.map((e: any) => migrateItem(e, emptyExperience()));
      merged.education = merged.education.map((e: any) => migrateItem(e, emptyEducation()));
      merged.activities = merged.activities.map((a: any) => migrateItem(a, emptyActivity()));
      merged.achievements = merged.achievements.map((a: any) => migrateItem(a, emptyAchievement()));
      merged.references = merged.references.map((r: any) => migrateItem(r, emptyReference()));
      return merged;
    }
  } catch {}
  return defaultData();
}

/* ------------------------------------------------------------------ */
/* Section shell component                                            */
/* ------------------------------------------------------------------ */

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6"
    >
      <h2 className="text-lg font-semibold text-white mb-6">{title}</h2>
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ResumeBuilderPage() {
  const router = useRouter();
  const [data, setData] = useState<ResumeData>(defaultData);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = loadSaved();
    setData(saved);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, hydrated]);

  const clearForm = () => {
    localStorage.removeItem(STORAGE_KEY);
    setData(defaultData());
  };

  /* ---------- generic updaters ---------- */

  const update = <K extends keyof ResumeData>(
    key: K,
    value: ResumeData[K],
  ) => setData((prev) => ({ ...prev, [key]: value }));

  const updateField = <K extends keyof ResumeData>(
    key: K,
    index: number,
    field: string,
    value: string,
  ) =>
    setData((prev) => {
      const arr = [...(prev[key] as any[])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [key]: arr };
    });

  const addItem = <K extends keyof ResumeData>(
    key: K,
    empty: () => any,
  ) => setData((prev) => ({ ...prev, [key]: [...(prev[key] as any[]), empty()] }));

  const removeItem = <K extends keyof ResumeData>(key: K, index: number) =>
    setData((prev) => {
      const arr = [...(prev[key] as any[])];
      if (arr.length > 1) arr.splice(index, 1);
      return { ...prev, [key]: arr };
    });

  /* ---------- project bullet helpers ---------- */

  const addProjectBullet = (projIndex: number) =>
    setData((prev) => {
      const projects = [...prev.projects];
      projects[projIndex] = {
        ...projects[projIndex],
        bulletPoints: [...projects[projIndex].bulletPoints, ""],
      };
      return { ...prev, projects };
    });

  const updateProjectBullet = (projIndex: number, bpIndex: number, value: string) =>
    setData((prev) => {
      const projects = [...prev.projects];
      const bps = [...projects[projIndex].bulletPoints];
      bps[bpIndex] = value;
      projects[projIndex] = { ...projects[projIndex], bulletPoints: bps };
      return { ...prev, projects };
    });

  const removeProjectBullet = (projIndex: number, bpIndex: number) =>
    setData((prev) => {
      const projects = [...prev.projects];
      const bps = projects[projIndex].bulletPoints.filter((_, i) => i !== bpIndex);
      projects[projIndex] = { ...projects[projIndex], bulletPoints: bps };
      return { ...prev, projects };
    });

  /* ---------- bullet helpers ---------- */

  const addBullet = (expIndex: number) =>
    setData((prev) => {
      const exps = [...prev.experiences];
      exps[expIndex] = {
        ...exps[expIndex],
        bulletPoints: [...exps[expIndex].bulletPoints, ""],
      };
      return { ...prev, experiences: exps };
    });

  const updateBullet = (expIndex: number, bpIndex: number, value: string) =>
    setData((prev) => {
      const exps = [...prev.experiences];
      const bps = [...exps[expIndex].bulletPoints];
      bps[bpIndex] = value;
      exps[expIndex] = { ...exps[expIndex], bulletPoints: bps };
      return { ...prev, experiences: exps };
    });

  const removeBullet = (expIndex: number, bpIndex: number) =>
    setData((prev) => {
      const exps = [...prev.experiences];
      const bps = exps[expIndex].bulletPoints.filter((_, i) => i !== bpIndex);
      exps[expIndex] = { ...exps[expIndex], bulletPoints: bps };
      return { ...prev, experiences: exps };
    });

  const inputClass =
    "bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-indigo-500 focus:ring-indigo-500/20";
  const labelClass = "text-white/80 text-sm";

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
              <BreadcrumbPage className="text-white">Resume Builder</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight bg-linear-to-r from-white to-white/70 bg-clip-text text-transparent">
                Resume Builder
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white/70 text-sm md:text-base mt-2"
            >
              Fill in your details below to build a professional resume.
            </motion.p>
          </div>

          <div className="space-y-8">
            {/* 1. Full Name */}
            <SectionCard title="Personal Info">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className={labelClass}>Full Name</Label>
                  <Input
                    className={inputClass}
                    placeholder="John Doe"
                    value={data.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className={labelClass}>Designation / Job Title</Label>
                  <Input
                    className={inputClass}
                    placeholder="Senior Software Engineer"
                    value={data.designation}
                    onChange={(e) => update("designation", e.target.value)}
                  />
                </div>
              </div>
            </SectionCard>

            {/* 3. Contact */}
            <SectionCard title="Contact">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className={labelClass}>Phone</Label>
                  <Input
                    className={inputClass}
                    placeholder="+1 234 567 8900"
                    value={data.phone}
                    onChange={(e) => update("phone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className={labelClass}>Email</Label>
                  <Input
                    className={inputClass}
                    placeholder="john@example.com"
                    value={data.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className={labelClass}>
                    GitHub <span className="text-white/40">(optional)</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      className={inputClass + " flex-1"}
                      placeholder="github.com/johndoe"
                      value={data.github}
                      onChange={(e) => update("github", e.target.value)}
                    />
                    <Input
                      className={inputClass + " w-[40%]"}
                      placeholder="Show as"
                      value={data.githubShow}
                      onChange={(e) => update("githubShow", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className={labelClass}>
                    LinkedIn <span className="text-white/40">(optional)</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      className={inputClass + " flex-1"}
                      placeholder="linkedin.com/in/johndoe"
                      value={data.linkedin}
                      onChange={(e) => update("linkedin", e.target.value)}
                    />
                    <Input
                      className={inputClass + " w-[40%]"}
                      placeholder="Show as"
                      value={data.linkedinShow}
                      onChange={(e) => update("linkedinShow", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className={labelClass}>
                    Portfolio URL <span className="text-white/40">(optional)</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      className={inputClass + " flex-1"}
                      placeholder="johndoe.dev"
                      value={data.portfolio}
                      onChange={(e) => update("portfolio", e.target.value)}
                    />
                    <Input
                      className={inputClass + " w-[40%]"}
                      placeholder="Show as"
                      value={data.portfolioShow}
                      onChange={(e) => update("portfolioShow", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* 4. Overview */}
            <SectionCard title="Professional Overview">
              <div className="space-y-2">
                <Label className={labelClass}>
                  Short description (max 250 characters)
                </Label>
                <Textarea
                  className={inputClass + " min-h-[100px]"}
                  placeholder="A brief summary of your professional background..."
                  maxLength={250}
                  value={data.overview}
                  onChange={(e) => update("overview", e.target.value)}
                />
                <p className="text-xs text-white/40 text-right">
                  {data.overview.length} / 250
                </p>
              </div>
            </SectionCard>

            {/* 5. Projects */}
            <SectionCard title="Projects">
              <div className="space-y-6">
                {data.projects.map((proj, i) => (
                  <motion.div
                    key={proj.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-white/60">
                        Project #{i + 1}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeItem("projects", i)}
                        disabled={data.projects.length === 1}
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className={labelClass}>Title</Label>
                        <Input
                          className={inputClass}
                          placeholder="Project Name"
                          value={proj.title}
                          onChange={(e) => updateField("projects", i, "title", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className={labelClass}>Status</Label>
                        <Input
                          className={inputClass}
                          placeholder="Complete / 95% Complete / In Progress"
                          value={proj.status}
                          onChange={(e) => updateField("projects", i, "status", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className={labelClass}>Live URL (optional)</Label>
                        <Input
                          className={inputClass}
                          placeholder="https://my-project.vercel.app"
                          value={proj.liveUrl}
                          onChange={(e) => updateField("projects", i, "liveUrl", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className={labelClass}>Tools (comma separated)</Label>
                        <Input
                          className={inputClass}
                          placeholder="React, Node.js, PostgreSQL"
                          value={proj.tools}
                          onChange={(e) => updateField("projects", i, "tools", e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Bullet Points */}
                    <div className="mt-4 space-y-2">
                      <Label className={labelClass}>Key Features / Descriptions</Label>
                      {proj.bulletPoints.map((bp, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-2">
                          <span className="text-indigo-400 shrink-0">•</span>
                          <Input
                            className={inputClass + " flex-1"}
                            placeholder="Describe a feature or detail"
                            value={bp}
                            onChange={(e) => updateProjectBullet(i, bIdx, e.target.value)}
                          />
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => removeProjectBullet(i, bIdx)}
                            disabled={proj.bulletPoints.length === 1}
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addProjectBullet(i)}
                        className="text-indigo-400 hover:bg-indigo-500/20"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add bullet point
                      </Button>
                    </div>
                  </motion.div>
                ))}
                <Button
                  onClick={() => addItem("projects", emptyProject)}
                  variant="default"
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Project
                </Button>
              </div>
            </SectionCard>

            {/* 6. Experiences */}
            <SectionCard title="Experience">
              <div className="space-y-6">
                {data.experiences.map((exp, i) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-white/60">
                        Experience #{i + 1}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeItem("experiences", i)}
                        disabled={data.experiences.length === 1}
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className={labelClass}>Designation</Label>
                        <Input
                          className={inputClass}
                          placeholder="Software Engineer"
                          value={exp.designation}
                          onChange={(e) => updateField("experiences", i, "designation", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className={labelClass}>Industry / Company</Label>
                        <Input
                          className={inputClass}
                          placeholder="Acme Corp"
                          value={exp.company}
                          onChange={(e) => updateField("experiences", i, "company", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className={labelClass}>Status</Label>
                        <Input
                          className={inputClass}
                          placeholder="Full-time / Part-time / Remote / Contract"
                          value={exp.status}
                          onChange={(e) => updateField("experiences", i, "status", e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label className={labelClass}>Start Date</Label>
                          <Input
                            className={inputClass}
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => updateField("experiences", i, "startDate", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className={labelClass}>End Date</Label>
                          <Input
                            className={inputClass}
                            type="month"
                            value={exp.endDate}
                            onChange={(e) => updateField("experiences", i, "endDate", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bullet Points */}
                    <div className="mt-4 space-y-2">
                      <Label className={labelClass}>Key Responsibilities / Achievements</Label>
                      {exp.bulletPoints.map((bp, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-2">
                          <span className="text-indigo-400 shrink-0">•</span>
                          <Input
                            className={inputClass + " flex-1"}
                            placeholder="Describe a responsibility or achievement"
                            value={bp}
                            onChange={(e) => updateBullet(i, bIdx, e.target.value)}
                          />
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => removeBullet(i, bIdx)}
                            disabled={exp.bulletPoints.length === 1}
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addBullet(i)}
                        className="text-indigo-400 hover:bg-indigo-500/20"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add bullet point
                      </Button>
                    </div>
                  </motion.div>
                ))}
                <Button
                  onClick={() => addItem("experiences", emptyExperience)}
                  variant="default"
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Experience
                </Button>
              </div>
            </SectionCard>

            {/* 6. Technical Skills */}
            <SectionCard title="Technical Skills">
              <div className="space-y-4">
                {data.skillGroups.map((sg, i) => (
                  <motion.div
                    key={sg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-white/60">
                        Skill Group #{i + 1}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeItem("skillGroups", i)}
                        disabled={data.skillGroups.length === 1}
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className={labelClass}>Category Title</Label>
                        <Input
                          className={inputClass}
                          placeholder="Languages, Frameworks, Tools..."
                          value={sg.title}
                          onChange={(e) => updateField("skillGroups", i, "title", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className={labelClass}>
                          Skills{" "}
                          <span className="text-white/40">(comma-separated)</span>
                        </Label>
                        <Input
                          className={inputClass}
                          placeholder="Java, Python, Dart"
                          value={sg.skills}
                          onChange={(e) => updateField("skillGroups", i, "skills", e.target.value)}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
                <Button
                  onClick={() => addItem("skillGroups", emptySkillGroup)}
                  variant="default"
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Skill Group
                </Button>
              </div>
            </SectionCard>

            {/* 7. Education */}
            <SectionCard title="Education">
              <div className="space-y-4">
                {data.education.map((edu, i) => (
                  <motion.div
                    key={edu.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-white/60">
                        Education #{i + 1}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeItem("education", i)}
                        disabled={data.education.length === 1}
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className={labelClass}>Course / Certificate</Label>
                        <Input
                          className={inputClass}
                          placeholder="B.Sc. in Computer Science"
                          value={edu.course}
                          onChange={(e) => updateField("education", i, "course", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className={labelClass}>Institution</Label>
                        <Input
                          className={inputClass}
                          placeholder="University Name"
                          value={edu.institution}
                          onChange={(e) => updateField("education", i, "institution", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className={labelClass}>Start Date</Label>
                        <Input
                          className={inputClass}
                          type="month"
                          value={edu.startDate}
                          onChange={(e) => updateField("education", i, "startDate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className={labelClass}>End Date</Label>
                        <Input
                          className={inputClass}
                          type="month"
                          value={edu.endDate}
                          onChange={(e) => updateField("education", i, "endDate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label className={labelClass}>
                          Result <span className="text-white/40">(optional)</span>
                        </Label>
                        <Input
                          className={inputClass}
                          placeholder="3.75 / 4.00"
                          value={edu.result}
                          onChange={(e) => updateField("education", i, "result", e.target.value)}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
                <Button
                  onClick={() => addItem("education", emptyEducation)}
                  variant="default"
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Education
                </Button>
              </div>
            </SectionCard>

            {/* 8. Extracurricular Activities */}
            <SectionCard title="Extracurricular Activities">
              <div className="space-y-4">
                {data.activities.map((act, i) => (
                  <motion.div
                    key={act.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-white/60">
                        Activity #{i + 1}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeItem("activities", i)}
                        disabled={data.activities.length === 1}
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className={labelClass}>Title</Label>
                        <Input
                          className={inputClass}
                          placeholder="Volunteer Club President"
                          value={act.title}
                          onChange={(e) => updateField("activities", i, "title", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className={labelClass}>Organization</Label>
                        <Input
                          className={inputClass}
                          placeholder="University Club"
                          value={act.organization}
                          onChange={(e) => updateField("activities", i, "organization", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className={labelClass}>Duration</Label>
                        <Input
                          className={inputClass}
                          placeholder="2022 - 2024"
                          value={act.duration}
                          onChange={(e) => updateField("activities", i, "duration", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className={labelClass}>
                          Description <span className="text-white/40">(optional)</span>
                        </Label>
                        <Input
                          className={inputClass}
                          placeholder="Brief description of your role"
                          value={act.description}
                          onChange={(e) => updateField("activities", i, "description", e.target.value)}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
                <Button
                  onClick={() => addItem("activities", emptyActivity)}
                  variant="default"
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Activity
                </Button>
              </div>
            </SectionCard>

            {/* 9. Achievements */}
            <SectionCard title="Achievements">
              <div className="space-y-4">
                {data.achievements.map((ach, i) => (
                  <motion.div
                    key={ach.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-white/60">
                        Achievement #{i + 1}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeItem("achievements", i)}
                        disabled={data.achievements.length === 1}
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className={labelClass}>Result</Label>
                        <Input
                          className={inputClass}
                          placeholder="Champion / 1st Runner-up / Top 10"
                          value={ach.result}
                          onChange={(e) => updateField("achievements", i, "result", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label className={labelClass}>Description</Label>
                        <Textarea
                          className={inputClass + " min-h-[80px]"}
                          placeholder="Describe the achievement, competition, or award"
                          value={ach.description}
                          onChange={(e) => updateField("achievements", i, "description", e.target.value)}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
                <Button
                  onClick={() => addItem("achievements", emptyAchievement)}
                  variant="default"
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Achievement
                </Button>
              </div>
            </SectionCard>

            {/* 10. References */}
            <SectionCard title="References">
              <div className="space-y-4">
                {data.references.map((ref, i) => (
                  <motion.div
                    key={ref.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-white/60">
                        Reference #{i + 1}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeItem("references", i)}
                        disabled={data.references.length === 1}
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className={labelClass}>Full Name</Label>
                        <Input
                          className={inputClass}
                          placeholder="Dr. Jane Smith"
                          value={ref.name}
                          onChange={(e) => updateField("references", i, "name", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className={labelClass}>Designation</Label>
                        <Input
                          className={inputClass}
                          placeholder="Professor"
                          value={ref.designation}
                          onChange={(e) => updateField("references", i, "designation", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className={labelClass}>Company / Institution</Label>
                        <Input
                          className={inputClass}
                          placeholder="University Name"
                          value={ref.company}
                          onChange={(e) => updateField("references", i, "company", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className={labelClass}>Phone</Label>
                        <Input
                          className={inputClass}
                          placeholder="+1 234 567 8900"
                          value={ref.phone}
                          onChange={(e) => updateField("references", i, "phone", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label className={labelClass}>Email</Label>
                        <Input
                          className={inputClass}
                          placeholder="jane.smith@example.com"
                          value={ref.email}
                          onChange={(e) => updateField("references", i, "email", e.target.value)}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
                <Button
                  onClick={() => addItem("references", emptyReference)}
                  variant="default"
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Reference
                </Button>
              </div>
            </SectionCard>

            {/* Continue */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="sticky bottom-6 z-10 flex justify-center"
            >
              <div className="rounded-2xl border border-white/10 bg-slate-900/90 backdrop-blur-md px-8 py-4 shadow-2xl shadow-black/40 flex items-center gap-4">
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  id="import-json"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      try {
                        const parsed = JSON.parse(ev.target?.result as string);
                        if (parsed.fullName !== undefined && parsed.projects !== undefined) {
                          setData(parsed);
                        } else {
                          alert("Invalid resume JSON file.");
                        }
                      } catch {
                        alert("Failed to parse JSON file.");
                      }
                    };
                    reader.readAsText(file);
                    e.target.value = "";
                  }}
                />
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => document.getElementById("import-json")?.click()}
                  className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                >
                  <Download className="w-4 h-4 mr-2" /> Import JSON
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={clearForm}
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  <RotateCcw className="w-4 h-4 mr-2" /> Clear
                </Button>
                <Button
                  size="lg"
                  disabled={!data.fullName.trim() || !data.designation.trim() || (!data.phone.trim() && !data.email.trim())}
                  onClick={() => {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                    router.push("/tools/resume-builder/preview");
                  }}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-10"
                >
                  <ArrowRight className="w-5 h-5 mr-2" /> Preview Resume
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
