import { SITE_URL } from "@/lib/site";
import { ISiteSettings } from "@/lib/models";

interface JsonLdProps {
  settings?: Partial<ISiteSettings> | null;
}

export function JsonLd({ settings }: JsonLdProps) {
  const name = settings?.name || "Kaium Al Limon";
  const title = settings?.title || "Full-Stack & Design Engineer";
  const description =
    settings?.headline ||
    "Crafting minimal interfaces, cross-platform apps, and resilient distributed services. Computer Science student at UIU.";

  const personId = `${SITE_URL}/#person`;
  const websiteId = `${SITE_URL}/#website`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name,
        alternateName: ["Limon", "kaiumallimon"],
        jobTitle: title,
        description,
        url: SITE_URL,
        image: `${SITE_URL}/og-image.png`,
        email: settings?.email ? `mailto:${settings.email}` : "mailto:kaiumallimon@gmail.com",
        address: {
          "@type": "PostalAddress",
          addressLocality: settings?.location || "Dhaka",
          addressCountry: "Bangladesh",
        },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "United International University",
          sameAs: "https://www.uiu.ac.bd",
        },
        sameAs: [
          settings?.githubUrl || "https://github.com/kaiumallimon",
          settings?.linkedinUrl || "https://linkedin.com/in/kaiumallimon",
          settings?.twitterUrl || "https://x.com/kaiumallimon",
        ].filter(Boolean),
        knowsAbout: [
          "Full-Stack Engineering",
          "Next.js",
          "Flutter",
          "FastAPI",
          "TypeScript",
          "React",
          "MongoDB",
          "PostgreSQL",
          "Docker",
          "Distributed Systems",
          "UI/UX Design",
        ],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: SITE_URL,
        name: `${name} Portfolio`,
        description,
        publisher: {
          "@id": personId,
        },
        inLanguage: "en-US",
      },
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/#profilepage`,
        url: SITE_URL,
        name: `${name} — ${title}`,
        isPartOf: {
          "@id": websiteId,
        },
        mainEntity: {
          "@id": personId,
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
