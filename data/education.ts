export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  description: string;
  status: "current" | "completed";
}

export const EDUCATION_DATA: EducationItem[] = [
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
