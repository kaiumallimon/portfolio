export interface ExperienceRole {
  id: string;
  role: string;
  period: string;
  isLightEngagement?: boolean;
}

export interface OrganizationGroup {
  organization: string;
  tagline: string;
  institution: string;
  location: string;
  roles: ExperienceRole[];
}

export const EXPERIENCE_DATA: OrganizationGroup = {
  organization: "UIU App Forum",
  tagline: "Premier Software Engineering & Mobile Innovation Club",
  institution: "United International University",
  location: "Dhaka, Bangladesh",
  roles: [
    {
      id: "head-software",
      role: "Head of Software & Innovation",
      period: "Sep 2024 — Oct 2025",
    },
    {
      id: "junior-executive",
      role: "Junior Executive of Development",
      period: "Aug 2023 — Sep 2024",
    },
    {
      id: "mentor-project-show",
      role: "Mentor — Grooming for CSE Project Show",
      period: "Aug 2023",
      isLightEngagement: true,
    },
  ],
};
