import type { Metadata } from "next";
import UIUExamRoutineView from "@/components/tools/uiu-exam-routine-view";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "UIU Exam Routine Generator & Schedule Finder",
  description:
    "Find, organize, and export customized exam and class schedules for United International University (UIU) students. Fast search by student ID and download as an image.",
  keywords: [
    "UIU Exam Routine",
    "UIU Exam Schedule",
    "United International University",
    "UIU Class Routine",
    "UIU Exam Finder",
    "Kaium Al Limon Tools",
  ],
  alternates: {
    canonical: `${SITE_URL}/tools/uiu-exam-routine`,
  },
  openGraph: {
    title: "UIU Exam Routine Generator | Kaium Al Limon",
    description:
      "Find and export your personalized exam and class routine for UIU courses.",
    url: `${SITE_URL}/tools/uiu-exam-routine`,
    type: "website",
    siteName: "Kaium Al Limon Portfolio",
  },
};

export default function UIUExamRoutinePage() {
  return <UIUExamRoutineView />;
}
