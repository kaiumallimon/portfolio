import type { Metadata } from "next";
import ToolsView from "@/components/tools/tools-view";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Developer Tools & Student Utilities",
  description:
    "Explore a curated suite of free interactive web tools by Kaium Al Limon, including GitHub Unwrapped stats visualizer, UIU CGPA Calculator, and UIU Exam Routine generator.",
  keywords: [
    "Developer Tools",
    "GitHub Unwrapped",
    "UIU Tools",
    "UIU CGPA Calculator",
    "UIU Exam Routine Finder",
    "Productivity Utilities",
    "Kaium Al Limon",
  ],
  alternates: {
    canonical: `${SITE_URL}/tools`,
  },
  openGraph: {
    title: "Developer Tools & Utilities | Kaium Al Limon",
    description:
      "Interactive web tools and university productivity utilities developed by Kaium Al Limon.",
    url: `${SITE_URL}/tools`,
    type: "website",
    siteName: "Kaium Al Limon Portfolio",
  },
};

export default function ToolsPage() {
  return <ToolsView />;
}
