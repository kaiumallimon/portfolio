import type { Metadata } from "next";
import GithubUnwrappedView from "@/components/tools/github-unwrapped-view";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "GitHub Unwrapped — Year in Code & Contribution Statistics",
  description:
    "Generate your personalized GitHub Year in Code card. Visualize your commit velocity, top languages, contribution heatmaps, streaks, and global developer rank.",
  keywords: [
    "GitHub Unwrapped",
    "GitHub Stats",
    "GitHub Year in Code",
    "Developer Stats Card",
    "Contribution Graph Visualizer",
    "Kaium Al Limon Tools",
  ],
  alternates: {
    canonical: `${SITE_URL}/tools/github-unwrapped`,
  },
  openGraph: {
    title: "GitHub Unwrapped | Kaium Al Limon",
    description:
      "Generate your personalized GitHub Year in Code stats card and contribution breakdown.",
    url: `${SITE_URL}/tools/github-unwrapped`,
    type: "website",
    siteName: "Kaium Al Limon Portfolio",
  },
};

export default function GithubUnwrappedPage() {
  return <GithubUnwrappedView />;
}
