import { Metadata } from "next";
import { getInitialChatState } from "./actions";
import { ContactChatClient } from "./contact-client";
import { SITE_URL } from "@/lib/site";

const title = "Contact & Collaboration — Kaium Al Limon";
const description =
  "Direct autonomous inquiry routing, collaboration inquiries, engineering contracts, and consulting with Kaium Al Limon.";
const ogImageUrl = `${SITE_URL}/og-image.png`;

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${SITE_URL}/contact`,
    title,
    description,
    siteName: "Kaium Al Limon Portfolio",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: title,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    site: "@kaiumallimon",
    creator: "@kaiumallimon",
    images: [ogImageUrl],
  },
};

// Force dynamic server-rendering so visitor IP telemetry and greeting are evaluated per request
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const { initialGreeting, initialSuggestions, telemetry } = await getInitialChatState();

  return (
    <ContactChatClient
      initialGreeting={initialGreeting}
      initialSuggestions={initialSuggestions}
      initialTelemetry={telemetry}
    />
  );
}
