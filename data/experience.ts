export interface ExperienceRole {
  id: string;
  role: string;
  period: string;
  description: string;
  bullets: string[];
  statChips: string[];
  skillTags: string[];
  gitHash: string; // Decorative git commit hash (e.g. "a3f9c21")
  isPromoted?: boolean; // Displays a "promoted" badge on the timeline connector
  isLightEngagement?: boolean; // Lighter/smaller dot for short mentorship roles
  isCurrent?: boolean;
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
      description:
        "Leading software development and student innovation initiatives at United International University's premier software engineering club.",
      bullets: [
        "Directed university-wide software workshops, mentoring 120+ students in Flutter and full-stack development.",
        "Spearheaded internal tooling projects and open-source campus initiatives.",
        "Coordinated project show grooming camps that produced multiple podium-winning teams.",
      ],
      statChips: [
        "120+ students mentored",
        "podium-winning teams",
        "campus open-source lead",
      ],
      skillTags: [
        "Flutter",
        "Full-Stack",
        "Clean Architecture",
        "System Architecture",
        "Leadership",
      ],
      gitHash: "a3f9c21",
      isPromoted: true,
      isCurrent: false,
    },
    {
      id: "junior-executive",
      role: "Junior Executive of Development",
      period: "Aug 2023 — Sep 2024",
      description:
        "Organized technical bootcamps, code reviews, and cross-platform app sprints for forum members.",
      bullets: [
        "Mentored junior developers in Git workflows, state management, and Clean Architecture.",
        "Engineered automated club utilities and event registration portals.",
      ],
      statChips: [
        "club utilities automated",
        "cross-platform sprints",
        "code review pipelines",
      ],
      skillTags: [
        "Flutter",
        "Dart",
        "BLoC",
        "Git",
        "Clean Architecture",
        "APIs",
      ],
      gitHash: "7e4b910",
      isCurrent: false,
    },
    {
      id: "mentor-project-show",
      role: "Mentor — Grooming for CSE Project Show",
      period: "Aug 2023",
      description:
        "Conducted specialized training bootcamps preparing undergraduate teams for the competitive UIU CSE Project Show.",
      bullets: [
        "Guided teams on architectural decisions, database normalization, and live pitch presentation.",
      ],
      statChips: [
        "project show grooming",
        "architecture mentoring",
      ],
      skillTags: [
        "System Design",
        "Database Normalization",
        "Technical Mentorship",
      ],
      gitHash: "3d20a8f",
      isLightEngagement: true,
      isCurrent: false,
    },
  ],
};
