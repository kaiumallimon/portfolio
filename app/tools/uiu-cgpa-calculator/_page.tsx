import type { Metadata } from "next";
import UIUCGPACalculatorView from "@/components/tools/uiu-cgpa-calculator-view";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "UIU CGPA Calculator & Trimester Grade Estimator",
  description:
    "Accurate and intuitive CGPA & SGPA calculator tailored to United International University (UIU) grading standards. Calculate cumulative GPA, plan courses, and export result cards.",
  keywords: [
    "UIU CGPA Calculator",
    "UIU GPA Calculator",
    "United International University",
    "Trimester CGPA Calculator",
    "UIU Grade Calculator",
    "Kaium Al Limon Tools",
  ],
  alternates: {
    canonical: `${SITE_URL}/tools/uiu-cgpa-calculator`,
  },
  openGraph: {
    title: "UIU CGPA Calculator | Kaium Al Limon",
    description:
      "Calculate your trimester GPA and cumulative CGPA according to UIU grading standards.",
    url: `${SITE_URL}/tools/uiu-cgpa-calculator`,
    type: "website",
    siteName: "Kaium Al Limon Portfolio",
  },
};

export default function UIUCGPACalculatorPage() {
  return <UIUCGPACalculatorView />;
}